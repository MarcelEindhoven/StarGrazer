/**
 * Responds to game HTTP request.
 *
 * @param {!express:Request} req HTTP request context.
 * @param {!express:Response} res HTTP response context.
 */
/* Commandline invocations:
Installation
  npm install --save express
  npm install --save node@10
  npm install --save firebase-admin
  npm install --save body-parser
  npm install --save cors
Deploy this function:
  gcloud functions deploy game --trigger-http --runtime=nodejs10
Test this function:
  curl -X PUT -H "Content-Type:application/json" --data {\"user\":\"user\",\"name\":\"tester\"} https://us-central1-stargrazer.cloudfunctions.net/game/1578792507372
  curl -X POST -H "Content-Type:application/json" --data {\"user\":\"test\"} https://us-central1-stargrazer.cloudfunctions.net/game
  curl -X GET -H "Content-Type:text/plain" https://us-central1-stargrazer.cloudfunctions.net/game/1578792507372
  curl -X GET -H "Content-Type:text/plain" https://us-central1-stargrazer.cloudfunctions.net/game/?status=initial
  curl -X DELETE https://us-central1-stargrazer.cloudfunctions.net/game/a
Required environment variable to authenticate for using firestore
  set GOOGLE_APPLICATION_CREDENTIALS="..\..\..\StarGrazer-5ccc8b373b2a.json"
  set GCLOUD_PROJECT = "stargrazer";
 */

const bodyParser = require('body-parser');
const cors = require('cors');
const admin = require('firebase-admin');

const express = require('express');
const app = express();

app.use(cors());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.use(function (request, response, next) {
  // Initialise works fine the first function call after deployment
  // After the first function call firestore may or may not have been initialised
  if (!admin.apps.length) {
      console.log("initialising firestore");
      admin.initializeApp();
  }
  next();
});

const SetGameUser = function(game, user, isOwner) {
  console.log("Writing game user " + user + " owner " + isOwner);
  return game.collection("users").doc(user).set({
    owner: isOwner
  });
};
        
app.get('/', function (req, res) {
    const status = req.query.status;
    const gamesSnapshot = admin.firestore().collection("games").where('status', '==', status);
    return gamesSnapshot.get()
    .then(snapshot => {
      var games = [];
      if (snapshot.empty) {
        console.log('No matching documents.');
        return;
      }  

      snapshot.forEach(doc => {
        console.log(doc.id, '=>', doc.data());
        games += doc.data();
      });
      res.status(200).send(games);
    })
    .catch(error => {
      console.log('Error getting documents', error);
        res.status(502).send('{"error":' + error +'}');
    });
  })
  .get('/:id', function (req, res) {
    const game = admin.firestore().collection("games").doc(req.params.id);
    return game.get()
    .then(function(doc) {
      if (doc.exists) {
        console.log("Document data " + doc.data());
        res.status(200).send(doc.data());//.json({"id":user ,"name": displayName});
      } else {
        error = "User " + req.params.id + " does not exist";
        console.error(error);
        res.status(501).send('{"error":' + error +'}');
      }
    })
    .catch(function(error) {
        console.error("Error getting document: ", error);
        res.status(502).send('{"error":' + error +'}');
    });

    res.send('Get ' + req.params.id);
  })
  .post('/', function (req, res) {
    const uniqueId = (new Date()).getTime().toString();
    console.log("game uniqueId = " + uniqueId);
    const user = req.body.user;
    console.log("user = " + user);

    const game = admin.firestore().collection("games").doc(uniqueId);
    return game
    .set({
        owner: user,
        status: 'initial'
    })
    .then(function() { return SetGameUser(game, user, true); })
    .then(function() {
        console.log("Document successfully written!");
        res.status(200).json({"id":uniqueId ,"owner": user});
    })
    .catch(function(error) {
        console.error("Error writing document: ", error);
        res.status(500).send('{"error":' + error +'}');
    });
  })
  .put('/:id', function (req, res) {
    const game = admin.firestore().collection("games").doc(req.params.id);
    const user = req.body.user;
    console.log("user = " + user);
    return SetGameUser(game, user, false)
    .then(function() {
        console.log("Document successfully written!");
        res.status(200).json({"user":user ,"owner": false});
    })
    .catch(function(error) {
        console.error("Error writing document: ", error);
        res.status(500).send('{"error":' + error +'}');
    });
  })
  .delete('/:id', function (req, res) {
    const game = admin.firestore().collection("games").doc(req.params.id);
    return game.delete()
    .then(function() {
        console.log("Game " + req.params.id + " successfully deleted!");
        res.status(200).send();
    })
    .catch(function(error) {
        console.error("Error deleting document: ", error);
        res.status(500).send('{"error":' + error +'}');
      });
  });

exports.game = app;
