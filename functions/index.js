const functions = require('firebase-functions');
const admin = require('firebase-admin');

let serviceAccount = require('../key/anonibus-cb1ea-firebase-adminsdk-fpaj2-f5f19c1d45.json');


admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
    databaseURL: "https://anonibus-cb1ea.firebaseio.com"
  });

var db = admin.firestore();

exports.enviarMensagem = functions.https.onRequest((request, response) => {

    let queryRef = db.collection('chats')
        .doc('sala_01').collection('mensagens').doc();
    queryRef.set({
        mensagem: request.body.mensagem,
        usuario: request.body.usuario,
        avatar: request.body.avatar
    }, { merge: true }).then(function () {
        response.json({ "ok": true })
    }).catch(function (err) {
        response.json({ "error": true })
    });
})