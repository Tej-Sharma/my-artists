import React, { Component } from 'react';

import PlayButton from '../../assets/playButton.png';
import PauseButton from '../../assets/pauseButton.png';

import './FooterAudioPlayer.css';

// Import Spotify from the Web API Wrapper for JS
var SpotifyAPI = require('spotify-web-api-js');

/**
 * Audio player that the user can control at the bottom
 * Will appear in all of the pages of the app so that the user
 * can play / pause at any time
 */
class FooterAudioPlayer extends Component {
  constructor(props) {
    super(props);

    this.state = {
      // User data
      aToken: window.localStorage.getItem('aToken'),
      loggedIn: false,
      // Spotify Player data
      player: null,
      deviceId: '',
      playing: false,
      spotifyUri: '',
    };

    // Set up the Spotify API
    this.spotifyApi = new SpotifyAPI();
    this.spotifyApi.setAccessToken(this.state.aToken);

    // for repedately trying to get the player
    // It may not be available the first time, so need to try multiple times
    this.getPlayerInterval = null;

    // bind functions to this
    this.playerStateChanged = this.playerStateChanged.bind(this);
    this.playHere = this.playHere.bind(this);
  }

  /**
   * Set up the audio component
   */
  componentDidMount() {
    // Check if logged in
    let loginTime = window.localStorage.getItem('loginTime');

    // Check if loginTime is null or login session has been expired
    if (
      loginTime == null ||
      loginTime === 'expired' ||
      new Date().getTime() - loginTime >= 3600 * 1000
    ) {
      // Logged in expired, do not show the state
      this.setState({ loggedIn: false });
    } else {
      // Logged in, load the album
      this.setState({ loggedIn: true });

      // Keep checking the player each second
      this.getPlayerInterval = setInterval(() => this.getSpotifyPlayer(), 1000);
    }
  }

  /**
   * A Spotify Webpack player from the SDK needs to be created and initialized
   * The Player created from the SDK in the public/index.html will be set here
   */
  getSpotifyPlayer() {
    if (window.Spotify !== null) {
      // Clear first
      clearInterval(this.getPlayerInterval);

      // Create a new player with the auth token
      this.player = new window.Spotify.Player({
        name: 'My Artists',
        getOAuthToken: (cb) => {
          cb(this.state.aToken);
        },
      });

      // Handle changes in state (i.e., pause, play) as well as errors
      this.createPlayerEventHandlers();

      // Connect the player to the SDK server!
      this.player.connect();
    }
  }

  /**
   * Handle events in the player as well as register the device_id
   * The primary event handlers are the 'player_state_changed' and 'on'
   */
  createPlayerEventHandlers() {
    // Handle Errors
    this.player.on('account_error', (e) => {
      console.error(e);
    });
    this.player.on('authentication_error', (e) => {
      console.error(e);
    });
    this.player.on('initialization_error', (e) => {
      console.error(e);
    });
    this.player.on('playback_error', (e) => {
      console.error(e);
    });

    // IMPORTANT state change: whenever a track is paused, play, etc.
    this.player.on('player_state_changed', (newState) =>
      this.playerStateChanged(newState)
    );

    // When the player is ready, store the deviceId for other functions to use
    this.player.on('ready', (data) => {
      let { device_id } = data;
      this.setState({ deviceId: device_id });
      this.playHere(device_id);
    });
  }

  /**
   * Transfer the player to play from THIS browser rather than on any other
   * device
   */
  playHere(devId) {
    this.spotifyApi
      .transferMyPlayback([devId], { limit: 10 })
      .then((result) => {
        console.log(result);
      })
      .catch((err) => console.log('Error transfering playback', err));
  }

  // Handle pausing / unpausing of music
  playerStateChanged(state) {
    if (state !== null) {
      const playing = !state.paused;
      this.setState({
        playing,
      });
    }
  }

  // Just pause / play the Spotify player
  onPlayClick = () => {
    this.player.togglePlay();
  };

  render() {
    return this.state.loggedIn ? (
      <div className="audioFooter">
        <input
          id="playButton"
          type="image"
          alt="Login"
          src={this.state.playing ? PauseButton : PlayButton}
          onClick={this.onPlayClick}
        />
        <br />
      </div>
    ) : (
      <div>{/* Not logged in: do not render */}</div>
    );
  }
}

export default FooterAudioPlayer;
