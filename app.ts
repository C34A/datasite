
'use strict';

// const express = require('express');
import express from "express";
const app = express();

// const sqlite3 = require('sqlite3');
// const sqlite = require('sqlite');
import sqlite3 from "sqlite3";
import {Database, open} from "sqlite";

const INVALID_PARAM_ERROR = 400;
const SERVER_ERROR = 500;
const SERVER_ERROR_MSG = 'Something went wrong on the server.';

const SENT_NAMES = [
  "sent1",
  "sent2",
  "sent3",
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

  const user = req.query.user;
  const strid = req.query.strid;
  if (!user || sent1 == null || sent2 == null || sent3 == null || !strid) {
    res.type("text");
    res.status(INVALID_PARAM_ERROR).send("Error: missing query parameters.");
    console.log("invalid request", {user, strid, sent1, sent2, sent3});
  } else {

    let db = await getDBConnection();

    const query = 
      "SELECT * FROM responses WHERE user LIKE ? AND strid = ?;";

    const existing = await db.all(query, user, strid);
    if (existing.length > 0) {
      console.warn("entry exists, overwriting!", existing);
      const replace =
        "UPDATE responses SET sent1 = ?, sent2 = ?, sent3 = ?" +
        " WHERE user LIKE ? AND strid = ?";
      await db.run(replace, sent1, sent2, sent3, user, strid);
    } else {
      const insert =
        "INSERT INTO responses (user, strid, sent1, sent2, sent3) " +
        "VALUES (?, ?, ?, ?, ?);";
    
      await db.run(insert, user, strid, sent1, sent2, sent3);
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