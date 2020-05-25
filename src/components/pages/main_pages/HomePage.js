import React, { Component } from 'react';

// React-Bootstrap components
import Pagination from 'react-bootstrap/Pagination';

// Components
import AlbumSearchItem from '../../utility/AlbumSearchItem';
import DisplayError from '../../utility/DisplayError';

// Import Spotify from the Web API Wrapper for JS
var SpotifyAPI = require('spotify-web-api-js');

class HomePage extends Component {
  constructor(props) {
    super(props);

    this.state = {
      loggedIn: false,
      // Get the access token directly from local storage
      aToken: window.localStorage.getItem('aToken'),
      // The search results that will be looped through
      searchResults: [],
      // track the page number
      page: 1,
      // for handlePagination to call searchArtist, need to store searchText
      searchText: '',
    };

    // Set up the Spotify API
    this.spotifyApi = new SpotifyAPI();
    this.spotifyApi.setAccessToken(this.state.aToken);

    // Store the previous HTTP request. When a new one is called, this will be
    this.prev = null;

    // Bind functions to this
    this.searchArtist = this.searchArtist.bind(this);
    this.getSearchResults = this.getSearchResults.bind(this);
    this.handlePagination = this.handlePagination.bind(this);
    this.handleSearchItemClick = this.handleSearchItemClick.bind(this);
  }

  /**
   * Check if logged in or not
   */
  componentDidMount() {
    let loginTime = window.localStorage.getItem('loginTime');

    if (
      loginTime == null ||
      loginTime === 'expired' ||
      new Date().getTime() - loginTime >= 3600 * 1000
    ) {
      // Login expired
      this.setState({ loggedIn: false });
    } else {
      this.setState({ loggedIn: true });
    }
  }

  /**
   * Called whenever the user edits the search bar and calls a search artits query
   * to the Spotify Web API. Dynamically loads in albums on search.
   * @param {*} event - reference to the search bar to retrieve its search text
   */
  searchArtist(event) {
    let searchText = event.target.value;
    if (searchText === '') {
      // Empty the search bar when the user deletes all text
      this.setState({ searchResults: [] });
      return;
    }

    // If there's a prev request, abort it to prevent duplicate, unneeded HTTP requests
    if (this.prev !== null) {
      this.prev.abort();
    }

    // Search for albums who have the typed artist
    // store the current promise in case we need to abort it
    // Limit to 10 to avoid spamming the API with unneeded data
    this.prev = this.spotifyApi.searchAlbums('artist:' + searchText, {
      limit: 50,
    });

    // This promise is separated to store only the searchQuery part in "this.prev"
    // so that .abort() can be called on it (or else the data type will change)
    this.prev
      .then((data) => {
        this.prev = null;
        this.setState({
          searchResults: data.albums.items,
        });
      })
      .catch((err) => console.log(err));
  }

  /**
   * Based on the results stored in state and the current page, display a list of search results
   * The array is sliced to control pagination
   */
  getSearchResults() {
    return this.state.searchResults
      .slice(this.state.page * 10 - 10, this.state.page * 10)
      .map((searchResult) => (
        <AlbumSearchItem
          searchResult={searchResult}
          handleSearchItemClick={this.handleSearchItemClick}
        />
      ));
  }

  // When page 1 is clicked, set the current to page 1 (etc. for each button)
  handlePagination = (event) => {
    this.setState({ page: parseInt(event.target.id) });
  };

  /**
   * When a search item is clicked, this will pass the data onto ViewAlbumPage.js
   * by redirecting to that website with the albumId in the URL
   * Where the user can view all the tracks of the album and play them
   */
  handleSearchItemClick(albumId) {
    this.props.history.push('/view-album/' + albumId);
  }

  render() {
    return this.state.loggedIn ? (
      <div>
        {/* Search bar to search for the artists */}
        <input
          type="text"
          required
          name="searchText"
          onChange={this.searchArtist}
          className="form-control"
          placeholder="Search albums by artist!"
          style={searchArtistStyle}
        />
        <br />

        {/* Get the search results */}
        <this.getSearchResults />

        <div>
          {
            // If there are no search results, do not show pagination
            this.state.searchResults.length > 0 ? (
              // Basic in-line pagination style
              <Pagination
                style={{
                  display: 'flex',
                  justifyContent: 'center',
                  fontSize: '0.7em',
                }}
              >
                <Pagination.Item
                  id="1"
                  onClick={this.handlePagination}
                  active={1 === this.state.page}
                >
                  {1}
                </Pagination.Item>
                <Pagination.Item
                  id="2"
                  onClick={this.handlePagination}
                  active={2 === this.state.page}
                >
                  {2}
                </Pagination.Item>
                <Pagination.Item
                  id="3"
                  onClick={this.handlePagination}
                  active={3 === this.state.page}
                >
                  {3}
                </Pagination.Item>
                <Pagination.Item
                  id="4"
                  onClick={this.handlePagination}
                  active={4 === this.state.page}
                >
                  {4}
                </Pagination.Item>
                <Pagination.Item
                  id="5"
                  onClick={this.handlePagination}
                  active={5 === this.state.page}
                >
                  {5}
                </Pagination.Item>
              </Pagination>
            ) : (
              <div></div>
            )
          }
          <br /> <br />
        </div>
      </div>
    ) : (
      // Not logged, show an error to the user
      <DisplayError
        showError={true}
        errors={['Please login to gain access to the site!']}
      />
    );
  }
}

const searchArtistStyle = {
  margin: '3px auto',
  width: '55%',
};

export default HomePage;
