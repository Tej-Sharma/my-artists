import React, { Component } from 'react';

// React-router-dom library to handle navigation
import { BrowserRouter as Router, Route } from 'react-router-dom';

// Use axios to handle HTTP requests
import axios from 'axios';

// Components
import MainNavbar from './components/navbar/MainNavbar';
import FooterAudioPlayer from './components/footer/FooterAudioPlayer';
import DisplayError from './components/utility/DisplayError';
// Page components
import LoginPage from './components/pages/account_pages/future_purposes/LoginPage';
import HomePage from './components/pages/main_pages/HomePage';
import SignupPage from './components/pages/account_pages/future_purposes/SignupPage';
import HandleLogin from './components/pages/account_pages/auth/HandleLogin';
import ViewAlbumPage from './components/pages/main_pages/ViewAlbumPage';
import AccountHistoryPage from './components/pages/account_pages/AccountHistoryPage';

// CSS for background styling
import './App.css';

/*
  The 'heart' of the program with the following features:
  1) Store the state and user details of the app
  2) Handle registering the user on first-time login
  3) Routing of the various page-components of the web app via React-Router-DOM
*/
class App extends Component {
  constructor(props) {
    super(props);

    this.state = {
      // user data
      loggedIn: false,
      displayName: '',
      // user credentials for API authorization
      aToken: '', // Needed for communication with the api
      rToken: '', // Needed to refresh aToken when it has expired (aToken lasts 1 hour only)
      // for displaying errors
      showError: false,
      errors: [],
    };

    // Bind the functions
    this.loginUser = this.loginUser.bind(this);
    this.retrieveOtherData = this.retrieveOtherData.bind(this);
  }

  /**
   * Called immediately after component's mount takes place
   * Ideal place to handle pre-setup
   * Check if the user is already logged in by checking localstorage
   * NOTE: local storage is not ideal for private data, but since we are not
   * requesting any private data (just authToken), it is safe to do so here
   */
  componentDidMount() {
    let aToken = window.localStorage.getItem('aToken');
    let rToken = window.localStorage.getItem('rToken');
    let loginTime = window.localStorage.getItem('loginTime');

    // If it has been more than an hour since last login, token has expired
    // Automatically refresh the user's auth token using the refresh Token, rToken
    if (loginTime === 'expired' || new Date().getTime() - loginTime >= 3600 * 1000) {
      axios
        .get(`http://localhost:8888/refresh_token`, {
          params: { refresh_token: rToken },
        })
        .then((res) => {
          aToken = res.data.access_token;
          this.loginUser(res.data.access_token, rToken);
        })
        .catch((err) => {
          // Unable to refresh the token.
          // Perhaps, user has changed their password / login details
          // Login token has expired, ask user to relogin
          window.localStorage.setItem('aToken', '');
          // For other componenets to easily check if the login is expired or not
          window.localStorage.setItem('loginTime', 'expired');
        });
    }

    if (aToken) {
      // Logged in, set the state accordingly and retrieve the user data
      this.setState({
        loggedIn: true,
        aToken,
        rToken,
      });

      // User data
      this.retrieveOtherData(aToken);
    } else {
      // Not logged in
      this.setState({ loggedIn: false });
    }
  }

  /**
   * Store the user's credentials retrieved from Spotify's web API in the state
   * and in local storage to allow user to be still logged in after page refresh
   * @param {*} access_token - returned from Spotify web API to access the user's data
   * @param {*} refresh_token - needed to request a refresh for the access_token
   */
  loginUser(aToken, rToken) {
    this.setState({
      loggedIn: true,
      aToken,
      rToken,
    });
    window.localStorage.setItem('aToken', aToken);
    window.localStorage.setItem('rToken', rToken);
    // After 1 hour, the auth token expires,
    // so this is used to check if the auth token has expired
    window.localStorage.setItem('loginTime', new Date().getTime());

    // Now, retrieve other data. This will also detect any login errors.
    this.retrieveOtherData(aToken);
  }

  /**
   * Retrieve the other data needed from the Spotify Web API via a Get request
   * @param {*} aToken - the authorization token
   */
  retrieveOtherData(aToken) {
    // If logged in, retrieve and store the username to display in the nav bar

    // Header to add the aToken to the request (will not get data without it)
    let headers = { headers: { Authorization: 'Bearer ' + aToken } };

    // Post a get request to the API using the header using axios
    axios
      .get('https://api.spotify.com/v1/me', headers)
      .then((res) => {
        this.setState({ displayName: res.data.display_name });
      })
      .catch((error) => {
        // Problem logging in, display an error and log it to the console as well
        console.log(error);
        this.setState({
          loggedIn: false,
          showError: true,
          errors: this.state.errors.concat(
            'Problem with authentication or login session has expired. Please try again.'
          ),
        });
      });
  }

  render() {
    // Router - handle the routing of the pages
    // Each route specifies the component that should be rendered on that URL location
    // The default route of "domainname.com" will render the HomePage.js component
    return (
      <Router>
        <div className="App">
          <div className="App-header">
            {/* The nav bar that handles navigation at the top. It is independent of the current URL location */}
            <MainNavbar
              loggedIn={this.state.loggedIn}
              displayName={this.state.displayName}
              fixed="top"
            />
            <br /> <br />
            {/* For displaying login or other errors */}
            <DisplayError
              showError={false}
              errors={this.state.errors}
              style={displayErrorStyle}
            />
            {/* Home page route: at the default location, the home page will be displayed*/}
            <Route
              path="/"
              exact
              render={(props) => <HomePage {...props} acToken={this.state.aToken} />}
            />
            {/* Login route: to the login page*/}
            <Route path="/login" exact component={LoginPage} />
            {/* Server callback: handles login and redirects to home page if logged in*/}
            <Route
              path="/login-done/:atoken&:rtoken"
              exact
              render={(props) => (
                <HandleLogin {...props} loginUser={this.loginUser} />
              )}
            />
            {/* View a specific album page */}
            <Route
              path="/view-album/:id"
              exact
              render={(props) => <ViewAlbumPage {...props} />}
            />
            {/* Allows the user to see their album viewing history */}
            <Route
              path="/my-history"
              exact
              render={(props) => <AccountHistoryPage {...props} />}
            />
            {/* External URL to the server which communicates with the Spotify Server for login */}
            <Route
              path="/spotify-login"
              component={() => {
                window.location.href = 'http://localhost:8888/login';
                return null;
              }}
            />
            {/* Handles playing the current track selected by the user in the footer */}
            <FooterAudioPlayer />
          </div>
        </div>
      </Router>
    );
  }
}

// Simple style for the display error component
const displayErrorStyle = {
  position: 'fixed',
  top: '0px',
  width: '50%',
  margin: '100px 0px 0px 0px',
};

export default App;
