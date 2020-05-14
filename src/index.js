import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import App from './App';
import * as serviceWorker from './serviceWorker';
import * as firebase from "firebase/app";


// Firebase backend - core app must be imported to initialize app with firebase
// Register firebase backend to the remote servers
// Config file of the firebase app (THIS NEEDS TO BE ASTERIKED OUT AS IT IS PRIVATE DATA)
// (This config file should not be shared with users)
// IMPORTANT Note: the IDs below have been asteriked because this is private data
// and should not be shared on a public GitHub repository
const firebaseConfig = {
  apiKey: "AIzaSyBraqgKxrrqLBkk6Jf4Y8b_H-47AoJjCKY",
  authDomain: "softie-pals.firebaseapp.com",
  databaseURL: "https://softie-pals.firebaseio.com",
  projectId: "softie-pals",
  storageBucket: "softie-pals.appspot.com",
  messagingSenderId: "2015829189",
  appId: "1:2015829189:web:178dfbed2c1c0c7453e4ac",
  measurementId: "G-WL8J92DEXV"
};

// Initialize the app using the config
firebase.initializeApp(firebaseConfig);

ReactDOM.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
  document.getElementById('root')
);

serviceWorker.unregister();

