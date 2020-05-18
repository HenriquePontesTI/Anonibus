import firebase from 'firebase';
import "firebase/auth";
import "firebase/firestore";
import "firebase/storage";

const firebaseConfig = {
    apiKey: "AIzaSyA837cdcjY5MpB9iaS95mKr7ZavfWYsP0w",
    authDomain: "anonibus-cb1ea.firebaseapp.com",
    databaseURL: "https://anonibus-cb1ea.firebaseio.com",
    projectId: "anonibus-cb1ea",
    storageBucket: "anonibus-cb1ea.appspot.com",
    messagingSenderId: "754359120078",
    appId: "1:754359120078:web:0c4d0bd87477e4a84e609f",
    measurementId: "G-TSENFX8VB3"
  };
export default !firebase.apps.length ?
    firebase.initializeApp(firebaseConfig) : firebase.app();