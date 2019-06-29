const express = require('express');
const functions = require('firebase-functions');
const admin = require('firebase-admin');
const serviceAccount = require('../config/serviceAccountKey.json');

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: "https://sample-1aae6.firebaseio.com"
});

const app = express();
const fireStore = admin.firestore();

app.get('/hellos', (req, res, next) => {
  fireStore.collection('hellos').get()
    // eslint-disable-next-line promise/always-return
    .then(snapshot => {
      let responses = [];
      snapshot.forEach(doc => {
        responses.push(doc.data());
      });
      res.json(responses);
    })
    .catch(err => {
      next(err);
    });
});

app.get('/hellos/japan', (req, res) => {
  res.send('こんにちは');
});

app.get('/hellos/usa', (req, res) => {
  res.send('hello');
});

exports.api = functions.https.onRequest(app);
