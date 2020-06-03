const functions = require('firebase-functions');
var admin = require("firebase-admin");
const path = require('path');


let serviceAccount = require("./anonibus-cb1ea-firebase-adminsdk-fpaj2-0b1abeef2a.json");

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: "https://anonibus-cb1ea.firebaseio.com"
});

  let db = admin.firestore();

  exports.enviarMensagem = functions.https
    .onRequest((request, response) => {
      let queryRef = db.collection('chats').doc('sala_01')
        .collection('mensagens').doc();
  
      queryRef.set({
        mensagem: request.body.mensagem,
        usuario: request.body.usuario,
        avatar: request.body.avatar,
      }).then(function () {
        response.json({
          "ok": true
        })
      })
        .catch(function () {
          response.json({
            "error": true
          })
        })
    })

    exports.imageUpdateFirestore = functions.storage.object().onFinalize(async (object) => {
      const filePath = object.name;
      const fileName = path.basename(filePath);
    
      await db.collection('imagens').doc(fileName).set(object);
    
      console.log(fileName, object)
    
      return
    })

    exports.salvarLocalizacao = functions.https
    .onRequest((request, response) => {
      let queryRef = db.collection('mapa').doc('localizacao_01')
        .collection('lugar').doc();
  
      queryRef.set({
        city: request.body.city,
        street: request.body.street,
        region: request.body.region,
        country: request.body.country
      }).then(function () {
        response.json({
          "ok": true
        })
      })
        .catch(function () {
          response.json({
            "error": true
          })
        })
    })