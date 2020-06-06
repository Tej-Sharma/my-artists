# My Artists

Responsive web app that allows you to search for all of the albums of your favorite artist
and even listen to all of the tracks in that album. In addition, it stores your album history using a backend server, so you can take it with you.

![Screenshot of App in Browser](https://github.com/Trollgen-Studios/my-artists/blob/master/my-artists-screenshot.png)

## The tech stack used

- ReactJS,
- Bootstrap (React-Bootstrap library),
- Node / Express / CORS (Backend for Auth-Server),
- Axios (frontend HTTP requests to backend),
- Spotify Web API, Spotify Web Playback SDK
- Firebase Backend (with Firestore NoSQL database) to store user history
- React Router DOM (multi page app)

## Responsive mobile demonstration

![Responsive demonstration](https://github.com/Trollgen-Studios/my-artists/blob/master/my-artists-responsive.JPG)

## Running the app

**Note: to access the user-history section, you must init and create your own Firebase credentials in 'src/index.js' and generate your Spotify API ids from the Spotify Developer website**

With that done, it's all pretty simple:
Starting at the root directory, please first 'npm install' all the required modules for both the front-end and the back-end:

$ npm install
    $ cd auth-server
\$ npm install

Then, the app can be run through starting the back-end and the front-end process

    $ cd auth-server/authorization_code
    $ node app.js

Then, in another terminal, in the root directory of "my-artists":

    $ npm start

## Backend code

This app uses the authorization code flow for the Spotify Web API in order to authenticate the user (this is mandatory to communicate with the Spotify API).

The backend code for the app is located in /auth-server/authorization_code/app.js

