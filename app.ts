
'use strict';

// const express = require('express');
import express from "express";
const app = express();

// const sqlite3 = require('sqlite3');
// const sqlite = require('sqlite');
import sqlite3 from "sqlite3";
import sqlite from "sqlite";

const INVALID_PARAM_ERROR = 400;
const SEVER_ERROR = 500;
const SERVER_ERROR_MSG = 'Something went wrong on the server.';

app.use(express.static('public'));



/**
 * Establishes a database connection to a database and returns the database object.
 * Any errors that occur during connection should be caught in the function
 * that calls this one.
 * @returns {Object} - The database object for the connection.
 */
 async function getDBConnection() {
    const db = await sqlite.open({
      filename: 'data.sqlite3',
      driver: sqlite3.Database
    });
    return db;
  }
  
  const PORT = process.env.PORT || 8000;
  app.listen(PORT);