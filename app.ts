
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
  "anticipation",
  "trust",
  "surprise",
  "sadness",
  "joy",
  "disgust",
  "positive",
  "negative",
  "neutral",
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
    return {
      id: -1,
      text: "This user has responded to all available strings.",
    };
  } else {
    return result[0];
  }
  db.close();
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
  const sent1 = strtobool(req.query[SENT_NAMES[0]] as string);
  const sent2 = strtobool(req.query[SENT_NAMES[1]] as string);
  const sent3 = strtobool(req.query[SENT_NAMES[2]] as string);
  const sent4 = strtobool(req.query[SENT_NAMES[3]] as string);
  const sent5 = strtobool(req.query[SENT_NAMES[4]] as string);
  const sent6 = strtobool(req.query[SENT_NAMES[5]] as string);
  const sent7 = strtobool(req.query[SENT_NAMES[6]] as string);
  const sent8 = strtobool(req.query[SENT_NAMES[7]] as string);
  const sent9 = strtobool(req.query[SENT_NAMES[8]] as string);
  const sent10 = strtobool(req.query[SENT_NAMES[9]] as string);
  const sent11 = strtobool(req.query[SENT_NAMES[10]] as string);
  const bad = strtobool(req.query[SENT_NAMES[11]] as string);

  const user = req.query.user;
  const strid = req.query.strid;
  if (!user || sent1 == null || sent2 == null || sent3 == null 
      || sent4 == null  || sent5 == null  || sent6 == null
      || sent7 == null  || sent8 == null  || sent9 == null
      || sent10 == null || sent11 == null || bad == null || !strid) {
    res.type("text");
    res.status(INVALID_PARAM_ERROR).send("Error: missing query parameters.");
    console.log("invalid request", {user, strid, sent1, sent2, sent3, sent4, sent5, sent6, sent7, sent8, sent9, sent10, sent11});
  } else {

    let db = await getDBConnection();

    const query = 
      "SELECT * FROM responses WHERE user LIKE ? AND strid = ?;";

    const existing = await db.all(query, user, strid);
    if (existing.length > 0) {
      console.warn("entry exists, overwriting!", existing);
      const replace =
        "UPDATE responses SET anger = ?, fear = ?, anticipation = ?" +
        ", trust = ?, surprise = ?, sadness = ?, joy = ?, disgust = ?" +
        ", pos = ?, neu = ?, negative = ?, bad = ?" +
        " WHERE user LIKE ? AND strid = ?";
      await db.run(
        replace,
        sent1,
        sent2,
        sent3,
        sent4,
        sent5,
        sent6,
        sent7,
        sent8,
        sent9,
        sent10,
        sent11,
        bad,
        user,
        strid
        );
    } else {
      const insert =
        "INSERT INTO responses (user, strid, anger, fear, anticipation, " +
        "trust, surprise, sadness, joy, disgust, pos, neg, neutral, bad) " +
        "VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?);";
    
      await db.run(insert, user, strid, sent1, sent2, sent3, sent4, sent5, sent6, sent7, sent8, sent9, sent10, sent11, bad);
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
    anticipation: boolean,
    trust: boolean,
    surprise: boolean,
    sadness: boolean,
    joy: boolean,
    disgust: boolean,
    positive: boolean,
    negative: boolean,
    neutral: boolean,
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
      anticipation: el.anticipation,
      trust: el.trust,
      surprise: el.surprise,
      sadness: el.sadness,
      joy: el.joy,
      disgust: el.disgust,
      positive: el.pos,
      negative: el.neg,
      neutral: el.neutral,
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
  let str = "user,string,anger,fear,anticipation,trust,surprise,sadness,joy,disgust,positive,negative,neutral,bad_data\r\n";

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
