
'use strict';

//anger fear anticipation trust surprise sadness joy disgust pos neg neutral 

// const express = require('express');
import express from "express";
const app = express();

// const sqlite3 = require('sqlite3');
// const sqlite = require('sqlite');
import sqlite3 from "sqlite3";
import {Database, open} from "sqlite";
import { arrayBuffer } from "stream/consumers";

const INVALID_PARAM_ERROR = 400;
const SERVER_ERROR = 500;
const SERVER_ERROR_MSG = 'Something went wrong on the server.';

const SENT_NAMES = [
  "anger",
  "fear",
  "surprise",
  "sadness",
  "joy",
  "disgust",
  "positive",
  "negative",
  "neutral",
  "ambiguous",
  "bad",
];

app.use(express.static('public'));

async function getString(user:string): Promise<Object> {
  let db = await getDBConnection();
  const query =
      "SELECT * FROM strings WHERE id NOT IN (SELECT strid FROM responses "
    + "WHERE user LIKE ?) ORDER BY random() LIMIT 1;";
  let result = await db.all(query, user);
  if (result.length != 1) {
    db.close();
    return {
      id: -1,
      text: "This user has responded to all available strings.",
    };
  } else {
    db.close();
    return result[0];
  }
}

app.get("/string", async function (req, res) {
  const user = req.query.user;
  if (!user) {
    res.type("text");
    res.status(INVALID_PARAM_ERROR).send("Error: missing username query parameter.");
  } else {
    try {
      res.json(await getString(user as string));
    } catch {
      res.type("text");
      res.status(SERVER_ERROR).send(SERVER_ERROR_MSG);
    }
  }
});

function strtobool(s: string): boolean | null {
  s = s.toLowerCase();
  if (s === "true") {
    return true;
  } else if (s === "false") {
    return false;
  } else {
    return null;
  }
}

app.get("/response", async function (req, res) {
  const anger = strtobool(req.query[SENT_NAMES[0]] as string);
  const fear = strtobool(req.query[SENT_NAMES[1]] as string);
  const surprise = strtobool(req.query[SENT_NAMES[2]] as string);
  const sadness = strtobool(req.query[SENT_NAMES[3]] as string);
  const joy = strtobool(req.query[SENT_NAMES[4]] as string);
  const disgust = strtobool(req.query[SENT_NAMES[5]] as string);
  const positive = strtobool(req.query[SENT_NAMES[6]] as string);
  const negative = strtobool(req.query[SENT_NAMES[7]] as string);
  const neutral = strtobool(req.query[SENT_NAMES[8]] as string);
  const ambiguous = strtobool(req.query[SENT_NAMES[9]] as string);
  const bad = strtobool(req.query[SENT_NAMES[10]] as string);

  const user = req.query.user;
  const strid = req.query.strid;
  if (!user || anger == null || fear == null || surprise == null 
      || sadness == null  || joy == null  || disgust == null
      || positive == null  || negative == null  || neutral == null
      || ambiguous == null || bad == null || !strid) {
    res.type("text");
    res.status(INVALID_PARAM_ERROR).send("Error: missing query parameters.");
    console.log("invalid request", {user, strid, anger, fear, surprise, sadness, joy, disgust, positive, negative, neutral, ambiguous, bad});
  } else {

    let db = await getDBConnection();

    const query = 
      "SELECT * FROM responses WHERE user LIKE ? AND strid = ?;";

    const existing = await db.all(query, user, strid);
    if (existing.length > 0) {
      console.warn("entry exists, overwriting!", existing);
      const replace =
        "UPDATE responses SET anger = ?, fear = ?, " +
        "surprise = ?, sadness = ?, joy = ?, disgust = ?" +
        ", pos = ?, neu = ?, negative = ?, ambiguous = ?, bad = ?" +
        " WHERE user LIKE ? AND strid = ?";
      await db.run(
        replace,
        anger,
        fear,
        surprise,
        sadness,
        joy,
        disgust,
        positive,
        neutral,
        negative,
        ambiguous,
        bad,
        user,
        strid
        );
    } else {
      const insert =
        "INSERT INTO responses (user, strid, anger, fear, " +
        "surprise, sadness, joy, disgust, pos, neg, neutral, ambiguous, bad) " +
        "VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?);";
    
      await db.run(insert, user, strid, anger, fear, surprise, sadness, joy, disgust, positive, negative, neutral, ambiguous, bad);
    }
    db.close();

    try {
      res.json(await getString(user as string));
    } catch {
      console.warn("get string failed");
      res.type("text");
      res.status(SERVER_ERROR).send(SERVER_ERROR_MSG);
    }
  }
});

app.get("/download", async function(req, res) {
  let strings: any = {};

  let db = await getDBConnection();

  strings[-1] = "NULL_STRING";
  (await db.all("select * from strings;")).forEach((el, i) => {
    const el2: {id: number, string: string} = el;
    strings[el2.id] = el.text;
  });
  type Response = {
    username: string,
    str: string,
    anger: boolean,
    fear: boolean,
    surprise: boolean,
    sadness: boolean,
    joy: boolean,
    disgust: boolean,
    positive: boolean,
    negative: boolean,
    neutral: boolean,
    ambiguous: boolean,
    bad: boolean,
  };

  let responses: any = [];
  
  (await db.all("select * from responses")).forEach((el, i) => {
    // console.log(el);
    responses.push({
      username: el.user,
      str: strings[el.strid],
      anger: el.anger,
      fear: el.fear,
      surprise: el.surprise,
      sadness: el.sadness,
      joy: el.joy,
      disgust: el.disgust,
      positive: el.pos,
      negative: el.neg,
      neutral: el.neutral,
      ambiguous: el.ambiguous,
      bad: el.bad,
    } as Response);
  });

  // console.log(strings);
  // console.log(responses);

  // res.type("text");
  // res.status(200).send(toCSV(responses));
  let csv = toCSV(responses);

  res.setHeader("Content-disposition", "attatchment; filename=data.csv");
  res.setHeader("Content-type", "text/csv");
  res.status(200).send(csv);

  db.close();
});

/**
 * convert data to csv
 * @param {[Object]} objArray the data
 */
function toCSV(objArray: [any]): string {
  let str = "user,string,anger,fear,surprise,sadness,joy,disgust,positive,negative,neutral,ambiguous,bad_data\r\n";

  for (let i = 0; i < objArray.length; i++) {
    let line = "";
    for (let index in objArray[i]) {
      if (line != "") line += ",";

      line += objArray[i][index];
    }
    str += line + "\r\n";
  }
  // console.log(str);
  return str;
}

/**
 * Establishes a database connection to a database and returns the database object.
 * Any errors that occur during connection should be caught in the function
 * that calls this one.
 * @returns {Promise<Database>} - The database object for the connection.
 */
 async function getDBConnection(): Promise<Database> {
  const db = await open({
    filename: 'data.db',
    driver: sqlite3.Database
  });
  return db;
}

const PORT = process.env.PORT || 8000;
app.listen(PORT);
