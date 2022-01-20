
'use strict';

// const express = require('express');
import express from "express";
const app = express();

// const sqlite3 = require('sqlite3');
// const sqlite = require('sqlite');
import sqlite3 from "sqlite3";
import {open} from "sqlite";

const INVALID_PARAM_ERROR = 400;
const SEVER_ERROR = 500;
const SERVER_ERROR_MSG = 'Something went wrong on the server.';

app.use(express.static('public'));

app.get("/string", async function (req, res) {
  const user = req.query.user;
  if (!user) {
    res.type("text");
    res.status(INVALID_PARAM_ERROR).send("Error: missing username query parameter.");
  } else {
    let db = await getDBConnection();
    const query = 
        "select * from strings where id not in (select strid from responses where user like ?) order by random() limit 1;";
    let respstring = await db.all(query, user);
    db.close();
    res.json(respstring);
  }
});

/**
 * Establishes a database connection to a database and returns the database object.
 * Any errors that occur during connection should be caught in the function
 * that calls this one.
 * @returns {Object} - The database object for the connection.
 */
 async function getDBConnection() {
  const db = await open({
    filename: 'data.db',
    driver: sqlite3.Database
  });
  return db;
}
  
const PORT = process.env.PORT || 8000;
app.listen(PORT);