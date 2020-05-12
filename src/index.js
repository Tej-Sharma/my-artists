import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import App from './App';
import * as serviceWorker from './serviceWorker';



ReactDOM.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
  document.getElementById('root')
);

serviceWorker.unregister();


/**
 * For future extensibility, a backend through Firebase can be connected to
 * store the users' details in our own remote NoSQL DB as well
 */

// Firebase backend - core app must be imported to initialize app with firebase
//import * as firebase from "firebase/app";
// Register firebase backend to the remote servers
// Config file of the firebase app (THIS NEEDS TO BE ASTERIKED OUT AS IT IS PRIVATE DATA)
// const firebaseConfig = {
//   apiKey: "*******",
//   authDomain: "my-artists.firebaseapp.com",
//   databaseURL: "https://my-artists.firebaseio.com",
//   projectId: "my-artists",
//   storageBucket: "my-artists.appspot.com",
//   messagingSenderId: "1086897329238",
//   appId: "*******",
//   measurementId: "G-GX5TC5YS8B"
// };
// // Initialize the app using the config
// firebase.initializeApp(firebaseConfig);
