/**
 * Built using the code provided by Spotify's Web SDK for the web app My Artists
 */

// Set up the needed libraries
var express = require('express');
var request = require('request'); // To handle some requests
var cors = require('cors');
var querystring = require('querystring');
var cookieParser = require('cookie-parser');

// The app's credentials to allow a user to login and return a token
var client_id = '8710bfff5bf047ee9744c590fa4fbb33';
var client_secret = '1480a6d7cbbf496a92ccd617e81f8aea';
var redirect_uri = 'http://localhost:8888/callback';

/**
 * Provided by Spotify API
 * Generates a random string containing numbers and letters
 * @param  {number} length The length of the string
 * @return {string} The generated string
 */
var generateRandomString = function (length) {
  var text = '';
  var possible = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';

  for (var i = 0; i < length; i++) {
    text += possible.charAt(Math.floor(Math.random() * possible.length));
  }
  return text;
};

// Track the current state of the authorization process
var stateKey = 'spotify_auth_state';

// Set app to represent express
var app = express();
app
  .use(express.static(__dirname + '/public'))
  .use(cors())
  .use(cookieParser());

// The login button on the main page will trigger this set up
app.get('/login', function (req, res) {
  var state = generateRandomString(16);
  res.cookie(stateKey, state);

  // Scopes provide the permissions from the user account being requested
  // Add scope / edit scope for future for adding new features
  // Additional scopes needed to be added to use the Spotify Web SDK
  var scope =
    'user-read-playback-state user-modify-playback-state user-read-currently-playing streaming app-remote-control user-read-private user-read-email playlist-read-collaborative playlist-modify-public playlist-read-private playlist-modify-private user-library-modify user-library-read user-top-read user-read-playback-position user-read-recently-played user-follow-read user-follow-modify';

  // Redirect to spotify's server with these data parameters
  res.redirect(
    'https://accounts.spotify.com/authorize?' +
      querystring.stringify({
        response_type: 'code',
        client_id: client_id,
        scope: scope,
        redirect_uri: redirect_uri,
        state: state,
      })
  );
});

// When the login process has been done, this will handle the final callback
app.get('/callback', function (req, res) {
  // The parameters to be retrieved from the request query
  var code = req.query.code || null;
  var state = req.query.state || null;
  var storedState = req.cookies ? req.cookies[stateKey] : null;

  // There was an error, need to be handled
  if (state === null || state !== storedState) {
    res.redirect(
      '/#' +
        querystring.stringify({
          error: 'state_mismatch',
        })
    );
  } else {
    // There were no errors! Can reuqest the authorization tokens

    // Generate the header and data to send via a post request to the API server
    res.clearCookie(stateKey);
    var authOptions = {
      url: 'https://accounts.spotify.com/api/token',
      form: {
        code: code,
        redirect_uri: redirect_uri,
        grant_type: 'authorization_code',
      },
      headers: {
        Authorization:
          'Basic ' + new Buffer(client_id + ':' + client_secret).toString('base64'),
      },
      json: true,
    };

    // Post the request with authOptions to request a token
    request.post(authOptions, function (error, response, body) {
      if (!error && response.statusCode === 200) {
        var access_token = body.access_token,
          refresh_token = body.refresh_token;

        var options = {
          url: 'https://api.spotify.com/v1/me',
          headers: { Authorization: 'Bearer ' + access_token },
          json: true,
        };

        // use the access token to access the Spotify Web API
        request.get(options, function (error, response, body) {
          console.log(body);
        });

        // Now, return to front-side client and store the tokens in the URL
        // They will be retrieved in the "HandleLogin.js" component in account_pages/auth
        res.redirect(
          'http://localhost:3000/login-done/' +
            querystring.stringify({
              access_token: access_token,
              refresh_token: refresh_token,
            })
        );
      } else {
        // There was an error, unable to do a successful login
        res.redirect(
          '/#' +
            querystring.stringify({
              error: 'invalid_token',
            })
        );
      }
    });
  }
});

// Spotify login sessions can only last one hour. After that,
// a new auth token needs to be requested using 'refresh_token' endpoint in the API
// Thus, this method in the backend will be called when the refresh is needed
app.get('/refresh_token', function (req, res) {
  var refresh_token = req.query.refresh_token;
  var authOptions = {
    url: 'https://accounts.spotify.com/api/token',
    headers: {
      Authorization:
        'Basic ' + new Buffer(client_id + ':' + client_secret).toString('base64'),
    },
    form: {
      grant_type: 'refresh_token',
      refresh_token: refresh_token,
    },
    json: true,
  };

  request.post(authOptions, function (error, response, body) {
    if (!error && response.statusCode === 200) {
      var access_token = body.access_token;
      res.send({
        access_token: access_token,
      });
    }
  });
});

// Start the server
console.log('Listening on 8888');
app.listen(8888);
