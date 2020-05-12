import React, { Component } from 'react'

// React-Bootstrap components
import Button from 'react-bootstrap/Button'
import Image from 'react-bootstrap/Image'
import Card from 'react-bootstrap/Card'
import Container from 'react-bootstrap/Container'
import Row from 'react-bootstrap/Row'
import Col from 'react-bootstrap/Col'

import './ViewAlbumPage.css'

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
         
         // Bind functions
         this.getArtists = this.getArtists.bind(this);
         this.getTracks = this.getTracks.bind(this);

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

            // Retrieve all of the album's details
            this.spotifyApi.getAlbum(this.props.match.params.id)
            .then(data => {
                this.setState({albumData: data});
            }).catch(err => console.log(err));
        }
    }

    /**
     * Convert the array of artists returned from the API into a string
     */
    getArtists() {
        var artistsStr = [];
        this.state.albumData.artists.forEach(artist => {artistsStr.push(artist.name)})
        return artistsStr.join();
    }

    playTrack() {
        console.log("PLAYING IT!");
    }

    getTracks() {
        console.log(this.state.albumData.tracks.items);
        return this.state.albumData.tracks.items.map(track => (
            <Container className="trackItem" fluid onClick={this.playTrack} >
                <Row>
                    <Col> {track.name} </Col>
                    <Col md="auto"> {this.convertTrackDuration(track.duration_ms)} </Col>
                </Row>
                <p>  </p>
               <div class="trackDuration">
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
                    <this.getTracks />

                {/* Add breaks to provide space for the footer */}
                <br /> <br /> 

            </div>
            :
            <div></div>
    }
}

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
