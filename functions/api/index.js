const express = require('express');
const functions = require('firebase-functions');

const app = express();

app.get('/hellos/japan', (req, res) => {
  res.send('こんにちは');
});

app.get('/hellos/usa', (req, res) => {
  res.send('hello');
});

exports.api = functions.https.onRequest(app);
