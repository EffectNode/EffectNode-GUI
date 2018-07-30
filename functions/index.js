// The Firebase Admin SDK to access the Firebase Realtime Database.
const functions = require('firebase-functions')

const admin = require('firebase-admin')
admin.initializeApp()

const db = admin.database()

const express = require('express')
const app = express()

const cors = require('cors')

// Automatically allow cross-origin requests
app.use(cors({ origin: true }))

const getByUIDPID = (uid, pid) => {
  return new Promise((resolve, reject) => {
    var ref = db.ref('/html-db/' + uid + '/' + pid)
    ref.once('value', (snapshot) => {
      resolve(snapshot.val())
    }, function (errorObject) {
      reject(errorObject.code)
    })
  })
}

app.get('/api/view/:uid/:pid', (req, res) => {
  getByUIDPID(req.params.uid, req.params.pid)
    .then((data) => {
      res.type('html')
      res.send(data)
    }, () => {
      res.status(404).json({ msg: 'not found' })
    })
})

exports.api = functions.https.onRequest(app)
