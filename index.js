require("./utils.js");

require('dotenv').config();
const express = require('express');
const session = require('express-session');
const MongoStore = require('connect-mongo');
const bcrypt = require('bcrypt');
const fs = require('fs');
const saltRounds = 12;

const port = process.env.PORT || 3000;

const app = express();

const Joi = require("joi");


const expireTime = 60 * 60 * 1000; //expires after 1 hour (minutes * seconds * millis)

/* secret information section */
const mongodb_host = process.env.MONGODB_HOST;
const mongodb_user = process.env.MONGODB_USER;
const mongodb_password = process.env.MONGODB_PASSWORD;
const mongodb_database = process.env.MONGODB_DATABASE;
const mongodb_session_secret = process.env.MONGODB_SESSION_SECRET;

const node_session_secret = process.env.NODE_SESSION_SECRET;

var {database} = include('databaseConnection');

const userCollection = database.db(mongodb_database).collection('users');

app.use(express.urlencoded({extended: false}));

var mongoStore = MongoStore.create({
  mongoUrl: `mongodb+srv://${mongodb_user}:${mongodb_password}@${mongodb_host}/sessions`,
  crypto: {
    secret: mongodb_session_secret
  }
})

app.use(session({ 
    secret: node_session_secret,
  store: mongoStore, //default is memory store 
  saveUninitialized: false, 
  resave: true
}
));

app.get("/", (req,res) => {
  res.send('hello');
})

app.get('/login', (req,res) => {
  const file = fs.readFileSync('public/html/login.html', 'utf-8');
  res.send(file);
})

app.get('/signup', (req,res) => {
  const file = fs.readFileSync('public/html/signup.html', 'utf-8');
  res.send(file);
})

app.get('/main', (req,res) => {
  if (!req.session.loggedIn) {
    res.redirect('/login');
  }
  res.send('you are logged in');
})

app.get("*", (req,res) => {
  res.status(404);
  res.send("Page not found - 404");
});