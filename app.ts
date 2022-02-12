
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
'admiration',
'amusement',
'anger',
'annoyance',
'approval',
'caring',
'confusion',
'curiosity',
'desire',
'disappointment',
'disapproval',
'disgust',
'embarrassment',
'excitement',
'fear',
'gratitude',
'grief',
'joy',
'love',
'nervousness',
'optimism',
'pride',
'realization',
'relief',
'remorse',
'sadness',
'surprise',
'neutral',
'bad string'
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
  const admiration = strtobool(req.query[SENT_NAMES[0]] as string);
  const amusement = strtobool(req.query[SENT_NAMES[1]] as string);
  const anger = strtobool(req.query[SENT_NAMES[2]] as string);
  const annoyance = strtobool(req.query[SENT_NAMES[3]] as string);
  const approval = strtobool(req.query[SENT_NAMES[4]] as string);
  const caring = strtobool(req.query[SENT_NAMES[5]] as string);
  const confusion = strtobool(req.query[SENT_NAMES[5]] as string);
  const curiosity = strtobool(req.query[SENT_NAMES[6]] as string);
  const desire = strtobool(req.query[SENT_NAMES[7]] as string);
  const disappointment = strtobool(req.query[SENT_NAMES[8]] as string);
  const disapproval = strtobool(req.query[SENT_NAMES[9]] as string);
  const disgust = strtobool(req.query[SENT_NAMES[10]] as string);
  const embarrassment = strtobool(req.query[SENT_NAMES[12]] as string);
  const excitement = strtobool(req.query[SENT_NAMES[11]] as string);
  const fear = strtobool(req.query[SENT_NAMES[13]] as string);
  const gratitude = strtobool(req.query[SENT_NAMES[14]] as string);
  const grief = strtobool(req.query[SENT_NAMES[15]] as string);
  const joy = strtobool(req.query[SENT_NAMES[16]] as string);
  const love = strtobool(req.query[SENT_NAMES[17]] as string);
  const nervousness = strtobool(req.query[SENT_NAMES[18]] as string);
  const optimism = strtobool(req.query[SENT_NAMES[19]] as string);
  const pride = strtobool(req.query[SENT_NAMES[21]] as string);
  const realization = strtobool(req.query[SENT_NAMES[11]] as string);
  const relief = strtobool(req.query[SENT_NAMES[22]] as string);
  const remorse = strtobool(req.query[SENT_NAMES[23]] as string);
  const sadness = strtobool(req.query[SENT_NAMES[24]] as string);
  const surprise = strtobool(req.query[SENT_NAMES[25]] as string);
  const neutral = strtobool(req.query[SENT_NAMES[26]] as string);
  const bad_string = strtobool(req.query[SENT_NAMES[27]] as string);


const user = req.query.user;
  const strid = req.query.strid;
    if (!user ||
	admiration == null || amusement == null || anger == null ||
	annoyance == null || approval == null || caring == null ||
	confusion == null || curiosity == null || desire == null ||
	disappointment == null || disapproval == null || disgust == null ||
	embarrassment == null || excitement == null || fear == null ||
	gratitude == null || grief == null || joy == null ||
	love == null || nervousness == null || optimism == null ||
	pride == null || realization == null || relief == null ||
	remorse == null || sadness == null || surprise == null ||
	neutral == null || bad_string == null ||
	!strid) {
    res.type("text");
    res.status(INVALID_PARAM_ERROR).send("Error: missing query parameters.");
	console.log("invalid request", {user, strid, admiration, amusement, anger, annoyance, approval, caring, confusion, curiosity, desire, disappointment, disapproval, disgust, embarrassment, excitement, fear, gratitude, grief, joy, love, nervousness, optimism, pride, realization, relief, remorse, sadness, surprise, neutral, bad_string});
  } else {

    let db = await getDBConnection();

  
    const query = 
      "SELECT * FROM responses WHERE user LIKE ? AND strid = ?;";


      
    const existing = await db.all(query, user, strid);
    if (existing.length > 0) {
      console.warn("entry exists, overwriting!", existing);
      const replace =
            "UPDATE responses SET "+ 
      	    "admiration = ?, amusement = ?, anger = ?, "+
	    "annoyance = ?, approval = ?, caring = ?, "+
	    "confusion = ?, curiosity = ?, desire = ?, "+
	    "disappointment = ?, disapproval = ?, disgust = ?, "+
	    "embarrassment = ?, excitement = ?, fear = ?, "+
	    "gratitude = ?, grief = ?, joy = ?, "+
	    "love = ?, nervousness = ?, optimism = ?, "+
	    "pride = ?, realization = ?, relief = ?, "+
	    "remorse = ?, sadness = ?, surprise = ?, "+
	    "neutral = ?, bad_string = ? "+
            " WHERE user LIKE ? AND strid = ?";
      await db.run(
          replace,
	  admiration,
	  amusement,
	  anger,
	  annoyance,
	  approval,
	  caring,
	  confusion,
	  curiosity,
	  desire,
	  disappointment,
	  disapproval,
	  disgust,
	  embarrassment,
	  excitement,
	  fear,
	  gratitude,
	  grief,
	  joy,
	  love,
	  nervousness,
	  optimism,
	  pride,
	  realization,
	  relief,
	  remorse,
	  sadness,
	  surprise,
	  neutral,
	  bad_string});
        user,
        strid
        );
    } else {
      const insert =
        "INSERT INTO responses (user, strid, admiration, amusement, anger, annoyance, approval, caring, confusion, curiosity, desire, disappointment, disapproval, disgust, embarrassment, excitement, fear, gratitude, grief, joy, love, nervousness, optimism, pride, realization, relief,remorse, sadness, surprise, neutral, bad_string)" +
            "VALUES ( ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?,?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?);";
    
      await db.run(insert, user, strid, admiration, amusement, anger, annoyance, approval, caring, confusion, curiosity, desire, disappointment, disapproval, disgust, embarrassment, excitement, fear, gratitude, grief, joy, love, nervousness, optimism, pride, realization, relief, remorse, sadness, surprise, neutral, bad_string);
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
    admiration: boolean,
    amusement: boolean,
    anger: boolean,
    annoyance: boolean,
    approval: boolean,
    caring: boolean,
    confusion: boolean,
    curiosity: boolean,
    desire: boolean,
    disappointment: boolean,
    disapproval: boolean,
    disgust: boolean,
    embarrassment: boolean,
    excitement: boolean,
    fear: boolean,
    gratitude: boolean,
    grief: boolean,
    joy: boolean,
    love: boolean,
    nervousness: boolean,
    optimism: boolean,
    pride: boolean,
    realization: boolean,
    relief: boolean,
    remorse: boolean,
    sadness: boolean,
    surprise: boolean,
    neutral: boolean,
    bad_string: boolean
  };

  let responses: any = [];
  
  (await db.all("select * from responses")).forEach((el, i) => {
    // console.log(el);
    responses.push({
      username: el.user,
      str: strings[el.strid],
      admiration: el.admiration,
      amusement: el.amusement,
      anger: el.anger,
      annoyance: el.annoyance,
      approval: el.approval,
      caring: el.caring,
      confusion: el.confusion,
      curiosity: el.curiosity,
      desire: el.desire,
      disappointment: el.disappointment,
      disapproval: el.disapproval,
      disgust: el.disgust,
      embarrassment: el.embarrassment,
      excitement: el.excitement,
      fear: el.fear,
      gratitude: el.gratitude,
      grief: el.grief,
      joy: el.joy,
      love: el.love,
      nervousness: el.nervousness,
      optimism: el.optimism,
      pride: el.pride,
      realization: el.realization,
      relief: el.relief,
      remorse: el.remorse,
      sadness: el.sadness,
      surprise: el.surprise,
      neutral: el.neutral,
      bad_string: el.bad_string,
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
  let str = "user,string,admiration, amusement, anger, annoyance, approval, caring, confusion, curiosity, desire, disappointment, disapproval, disgust, embarrassment, excitement, fear, gratitude, grief, joy, love, nervousness, optimism, pride, realization, relief,remorse, sadness, surprise, neutral, bad_string\r\n";

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
