import React, { Component } from 'react'

// React-Bootstrap components
import Image from 'react-bootstrap/Image'
import Container from 'react-bootstrap/Container'

import axios from 'axios'

// Styling and a fun animation for the track results
import './ViewAlbumPage.css'

// Add the Firebase products that you want to use
var firebase = require("firebase/app");
require("firebase/firestore");

// Import Spotify from the Web API Wrapper for JS
var SpotifyAPI = require('spotify-web-api-js');

export class ViewAlbumPage extends Component {

    constructor(props) {
        super(props);

        this.state = {
            // User data
            aToken: window.localStorage.getItem('aToken'),
            loggedIn: false,
            // Album data (in one object to avoid repetiton of data and inefficent storage)
            albumData: null,
        }

         // Set up the Spotify API
         this.spotifyApi = new SpotifyAPI();
         this.spotifyApi.setAccessToken(this.state.aToken); 

         // Firebase DB access for history
         this.db = firebase.firestore();

         
         // Bind functions
         this.getArtists = this.getArtists.bind(this);
         this.getTracks = this.getTracks.bind(this);
         this.playTrack = this.playTrack.bind(this);
         this.addToHistory = this.addToHistory.bind(this);
    }

    componentDidMount() {
        // Check if logged in
        let loginTime = window.localStorage.getItem('loginTime');
        let aToken = window.localStorage.getItem('aToken');
        
        if(loginTime == null || loginTime === 'expired' || 
            new Date().getTime() - loginTime >= 3600 * 1000) {
                this.setState({loggedIn: false})
        } else {
            // Logged in, load the album
            this.setState({loggedIn: true})

            // Retrieve all of the album's details and store it in the component's state
            this.spotifyApi.getAlbum(this.props.match.params.id)
            .then(data => {
                this.setState({albumData: data});

                // Now, get the user's display name. This needs to be retrieved in order
                // to access the DB to save the user's album history. Use a HTTP GET request.
                let headers = { headers: { 'Authorization': 'Bearer ' + aToken } }
                axios.get('https://api.spotify.com/v1/me', headers)
                .then(res => {
                    this.addToHistory(res.data.display_name, data);
                }).catch((error) => {
                    console.log(error);
                })
            }).catch(err => console.log(err));

        }
    }

    /**
     * Using the Firebase backend DB, add this album to the user's viewed history
     */
    addToHistory(displayName, albumData) {
        this.db.collection("user_history").doc(displayName)
        .collection("viewed_albums").doc().set({
            albumData
        }).catch(err => console.log (err));
    }

    /**
     * Simple one line Convert the array of artists returned from the API into a string
     */
    getArtists = () => { 
        return this.state.albumData.artists.map(artist => (artist.name)).join(", ");
    }

    /**
     * When an album is clicked, get the current player's device id (the browser)
     * and then play the track selected by the user
     */
    playTrack(trackUri) {
        this.spotifyApi.play({"uris": [trackUri]}).then(result => {
            // The track is successfully playing
            // If further action is needed, it can be taken ehre
        }).catch(err => console.log("Error playing track ", err));
    }

    getTracks() {
        // Return a list of tracks
        // Responsive design in the CSS to handle mobile scaling seamlessly
        return this.state.albumData.tracks.items.map(track => (
            <Container className="trackItem" fluid onClick={this.playTrack.bind(this, track.uri)} >
                <div className="trackName"> {track.name} </div>
               <div className="trackDuration">
               {this.convertTrackDuration(track.duration_ms)}
               </div>
          </Container>
        ));
    }

    /**
     * Helper method to get track time in mm:ss
     * @param {} duration_ms - the duration in miliseconds 
     */
    convertTrackDuration(duration_ms) {
        var secs = ((duration_ms % 60000) / 1000).toFixed(0);
        var mins = Math.floor(duration_ms / 60000);
        return mins + ":" + (secs < 10 ? '0' : '') + secs;
    }

    render() {
        let data = this.state.albumData;
        return data != null ?
            <div className="mainContent">
                <div style={headerMain}>
                    <table style={tableStyle}>
                        <tbody>
                            <tr>
                                {/* Track header that shows the photo, name, date, and artists */}
                                <th style={colStyle1}>
                                    <Image src={data.images[0].url} style={imageStyle}/>
                                </th>
                                <th style={colStyle2}>
                                    <h3>{data.name}</h3>
                                    <h6> <this.getArtists /> </h6>
                                    <h6> {new Date(data.release_date).toDateString()} </h6>
                                </th>                 
                            </tr>
                        </tbody>
                    </table>
                </div>
                <p style={{'color': 'rgba(0, 0, 0, 0)', 'fontSize': '0.5em'}}> placeholder </p>
               
                {/* Retrieve the list of tracks. */}
                <this.getTracks />

                {/* Add breaks to provide space for the footer */}
                <br /> <br /> 

            </div>
            :
            <div>
                {/* If the user is not logged in, data will be null, so no need to check for 
                    login */ }
            </div>
    }
}

// Some small styles added here to prevent putting too much in the css file
const headerMain = {
    'position': 'relative'
}

const imageStyle = {
    'width': '150px',
    'height': '150px'
}

// To style the table and arrange the top picture and descriptors
const tableStyle = {
    'tableLayout': 'auto',
    'width': '100%',
    'align': 'left',
    'float': 'left',

}
const colStyle1 = {
    'width': '160px',
    'height': '160px',
    'margin': '0px 40px 0px 0px'
}

const colStyle2 = {
    'padding': '5px',
    'margin': '0px 40px 0px 0px'
}


export default ViewAlbumPage
