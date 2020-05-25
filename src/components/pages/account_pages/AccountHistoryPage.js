import React, { Component } from 'react';

// Use axios to handle HTTP requests
import axios from 'axios';

// Components
import AlbumSearchItem from '../../utility/AlbumSearchItem';

// Add Firebase and the "firestore" DB module needed
var firebase = require('firebase/app');
require('firebase/firestore');

/**
 * The user can view their album history
 */
class AccountHistoryPage extends Component {
  constructor(props) {
    super(props);

    this.state = {
      // Store the albums retrieved from history
      albums: [],
    };

    // Firebase DB access for history
    this.db = firebase.firestore();

    // Bind data
    this.loadAlbumHistory = this.loadAlbumHistory.bind(this);
    this.getAlbums = this.getAlbums.bind(this);
    this.handleSearchItemClick = this.handleSearchItemClick.bind(this);
  }

  /**
   * Load in the album history of the user
   */
  componentDidMount() {
    // Set the get request header
    let aToken = window.localStorage.getItem('aToken');
    let headers = { headers: { Authorization: 'Bearer ' + aToken } };

    // Post a get request to the API using the header using axios
    axios
      .get('https://api.spotify.com/v1/me', headers)
      .then((res) => {
        this.loadAlbumHistory(res.data.display_name);
      })
      .catch((error) => {
        console.log(error);
      });
  }

  // Load album history
  loadAlbumHistory(displayName) {
    // make sure displayName exists
    if (displayName) {
      this.db
        .collection('user_history')
        .doc(displayName)
        .collection('viewed_albums')
        .get()
        .then((queryResult) => {
          queryResult.forEach((albumData) => {
            this.setState({
              albums: this.state.albums.concat(albumData.data().albumData),
            });
          });
          console.log(this.state.albums);
        });
    }
  }

  /**
   * When a search item is clicked, this will pass the data onto a page for the album page
   * Where the user can view all the tracks of the album and play them
   */
  handleSearchItemClick(albumId) {
    this.props.history.push('/view-album/' + albumId);
  }

  /**
   * Display the list of albums obtained from the Firebase DB
   */
  getAlbums() {
    return this.state.albums.map((searchResult) => (
      <AlbumSearchItem
        searchResult={searchResult}
        handleSearchItemClick={this.handleSearchItemClick}
      />
    ));
  }

  render() {
    return (
      <div style={{ padding: '5px' }}>
        <h2> Check out your account history </h2>
        <hr style={{ borderColor: 'inherit' }}></hr>
        <br />

        {/* Get a list of albums similar to search result items */}
        <this.getAlbums />
      </div>
    );
  }
}

export default AccountHistoryPage;
