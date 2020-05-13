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
const firebaseConfig = {
  apiKey: "AIzaSyA67weoRnKUtJR7GHzwOhSNy1Dkd-eusKo",
  authDomain: "my-artists.firebaseapp.com",
  databaseURL: "https://my-artists.firebaseio.com",
  projectId: "my-artists",
  storageBucket: "my-artists.appspot.com",
  messagingSenderId: "1086897329238",
  appId: "1:1086897329238:web:6890d0723120ed1f4c97f7",
  measurementId: "G-GX5TC5YS8B"
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

