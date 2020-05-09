import React, { Component } from 'react';
// CSS for styling
import './App.css'; 
// React-router-dom library to handle navigation
import { BrowserRouter as Router, Route } from 'react-router-dom';
// Componenents
import MainNavbar from './components/navbar/MainNavbar';

import LoginPage from './components/pages/account_pages/LoginPage';
import HomePage from './components/pages/main_pages/HomePage'
import SignupPage from './components/pages/account_pages/SignupPage';

/*
  The 'heart' of the program. Will contain the following features:
  1) Store the general state
  2) Routing of the various page-components of the web app
*/
class App extends Component {
  render() {
    // Router - handle the routing of the pages
    // Each route specifies the component that should be rendered on that URI location
    return (
      <Router>
        <div className="App">
          <div className="App-header">

              {/* The nav bar that handles navigation at the top. It is independent of the current URL location */}
              <MainNavbar />

              {/* Home page route: at the default location, the home page will be displayed*/}
              <Route
                path="/"
                exact
                component={HomePage}
              />

              {/* Login route: to the login page*/}
              <Route
                path="/login"
                exact
                component={LoginPage}
              />

              {/* Login route: to the login page*/}
              <Route
                path="/signup"
                exact
                component={SignupPage}
              />
          </div>
        </div>       
      </Router>
      
    );
  }
}


export default App;
