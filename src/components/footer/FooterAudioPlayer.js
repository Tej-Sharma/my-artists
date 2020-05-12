import React, { Component } from 'react'

// React-Bootstrap components
import Navbar from 'react-bootstrap/Navbar';
import Nav from 'react-bootstrap/Nav';
import Button from 'react-bootstrap/Button';

// To handle a responsive design for mobile
import {isMobile} from 'react-device-detect';

// To play the song
import SpotifyPlayer from 'react-spotify-web-playback';

// Import Spotify from the Web API Wrapper for JS
var SpotifyAPI = require('spotify-web-api-js');

/**
 * Audio player that the user can control at the bottom
 */
export class FooterAudioPlayer extends Component {
    
    constructor(props) {
        super(props);

        this.state = {
            // User data
            aToken: window.localStorage.getItem('aToken'),
            playerToken: 'BQBmb46sONYDpHCOSB-K5K7-vR5_DL83aHd5LM4qeuI1rOd4BArkLNgCaoh8-AmKpZDPTgY0Kj6HDftc2-6PX72-COfDr5PDzr-2PkwxbZ94AuHh-lfKxp-dGucoQdC9uAqUnTfXoBhFAjGGwLxrmFZevD8I7M2zPAQmRSercCYUxqUak9JQlRVvnyKn7u1dQ3OOg8cv3U8',
            loggedIn: false,
            player: null,
            deviceId: '',
        }

        // for repedately trying to get the player
        this.getPlayerInterval = null;
    }

    componentDidMount() {
        // Check if logged in
        let loginTime = window.localStorage.getItem('loginTime');

        if(loginTime == null || 
            loginTime === 'expired' || 
            new Date().getTime() - loginTime >= 3600 * 1000) {
                this.setState({loggedIn: false})
        } else {
            // Logged in, load the album
            this.setState({loggedIn: true})

            // Keep checking the player each second
            this.getPlayerInterval = setInterval(() => this.getSpotifyPlayer(), 1000);
        }
    }

    getSpotifyPlayer() {
        if (window.Spotify !== null) {
            console.log("WE GOT TO HERE!");
            clearInterval(this.getPlayerInterval);

            this.player = new window.Spotify.Player({
              name: "My Artists",
              getOAuthToken: cb => { cb(this.state.playerToken); },
            });
            this.createPlayerEventHandlers();
        
            this.player.connect();
        }
    }

    createPlayerEventHandlers() {
        this.player.on('initialization_error', e => { console.error(e); });
        this.player.on('authentication_error', e => {
          console.error(e);
          this.setState({ loggedIn: false });
        });
        this.player.on('account_error', e => { console.error(e); });
        this.player.on('playback_error', e => { console.error(e); });
      
        // Playback status updates
        this.player.on('player_state_changed', state => { console.log(state); });
      
        // Ready
        this.player.on('ready', data => {
          let { device_id } = data;
          console.log("Let the music play on!");
          this.setState({ deviceId: device_id });
        });
      }

    render() {
        // If it is a mobile system, change the nav bar to accomdate the screen size
        /**
         * https://api.spotify.com/v1/tracks/3iBOe7U7kRPNIoL3QLCVu2
         * 
         * https://open.spotify.com/track/3iBOe7U7kRPNIoL3QLCVu
         */
        return this.state.loggedIn ? 
            <div>
                
                
                
            </div>
        :
            <div></div>
    }
}

export default FooterAudioPlayer
