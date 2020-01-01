/**
 * Responds to user HTTP request.
 *
 * @param {!express:Request} req HTTP request context.
 * @param {!express:Response} res HTTP response context.
 */
/* Commandline invocations:
Installation
  npm install node@10
  npm install firebase-admin
Deploy this function:
  gcloud functions deploy user --trigger-http --runtime=nodejs10
  firebase deploy --only functions
Test this function:
  curl -X PUT -H "Content-Type:application/json" --data {\"id\":\"test\",\"name\":\"tester\"} https://us-central1-stargrazer.cloudfunctions.net/user
  curl -X GET -H "Content-Type:text/plain" https://us-central1-stargrazer.cloudfunctions.net/user/a
  curl -X DELETE https://us-central1-stargrazer.cloudfunctions.net/user/a
Required environment variable to authenticate for using firestore
  set GOOGLE_APPLICATION_CREDENTIALS="..\..\..\StarGrazer-5ccc8b373b2a.json"
  set GCLOUD_PROJECT = "stargrazer";
 */
exports.user = (req, res) => {
  console.log("req.method " + req.method);

  // CORS policy
  // Note that the preflighted request as well as the actual request must contain control headers
  res.header("Access-Control-Allow-Origin", "*");
  res.header('Access-Control-Allow-Methods', 'PUT, POST, GET, DELETE, OPTIONS');
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type,authorization,Accept");
  res.header('Access-Control-Allow-Credentials', 'true'); 

  if (req.method === 'OPTIONS') {
    res.status(200).send();
    return ;
  }
  res.setHeader("Content-Type", "application/json");

  // The remaining actions require firestore access
  console.log("require('firebase-admin') ;");
  const admin = require('firebase-admin');
  // Initialise works fine the first function call after deployment
  // After the first function call firestore may or may not have been initialised
  if (!admin.apps.length) {
      console.log("initialising firestore");
      admin.initializeApp();
  }
  console.log("firestore initialised");
  var db = admin.firestore();
  console.log("db = admin.firestore();");
  if (req.method === 'PUT') {
    var user = req.body.id;
    console.log("user " + user);
    var name = req.body.name;
    console.log("displayName " + name);

    // Add a new document in collection "users"
    return db.collection("users").doc(user).set({
        name: name
    })
    .then(function() {
        console.log("Document successfully written!");
        res.status(200).json({"id":user ,"name": name});
    })
    .catch(function(error) {
        console.error("Error writing document: ", error);
        res.status(500).send('{"error":' + error +'}');
    });
  }
  // GET or DELETE
  // Input data is retrieved from the URL
  console.log("req.url " + req.url);
  user = req.url.toString().slice(1);
  console.log("user " + user);
  if (req.method === 'DELETE') {
    return db.collection("users").doc(user).delete()
    .then(function() {
        console.log("Document successfully deleted!");
        res.status(200).send();
    })
    .catch(function(error) {
        console.error("Error deleting document: ", error);
        res.status(500).send('{"error":' + error +'}');
    });
  }
  if (req.method === 'GET') {
    return db.collection("users").doc(user).get()
    .then(function(doc) {
      if (doc.exists) {
        displayName = doc.data().name;
        console.log("Document data " + doc.data());
        console.log("Document data displayName " + doc.data().name);
        res.status(200).json({"id":user ,"name": displayName});
      } else {
        error = "User " + user + " does not exist";
        console.error(error);
        res.status(501).send('{"error":' + error +'}');
      }
    })
    .catch(function(error) {
        console.error("Error getting document: ", error);
        res.status(502).send('{"error":' + error +'}');
    });
  }
};
