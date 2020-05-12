import React, { Component } from 'react'

// React-Bootstrap components
import Pagination from 'react-bootstrap/Pagination';
import Form from 'react-bootstrap/Form';
import InputGroup from 'react-bootstrap/InputGroup';
import FormControl from 'react-bootstrap/FormControl';
import Button from 'react-bootstrap/Button';

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
        }

        // Set up the Spotify API
        this.spotifyApi = new SpotifyAPI();
        this.spotifyApi.setAccessToken(this.state.aToken);
        
        // Store the previous HTTP request. When a new one is called, this will be
        this.prev = null;

        this.searchArtist = this.searchArtist.bind(this);
        this.getSearchResults = this.getSearchResults.bind(this);
        this.handlePagination = this.handlePagination.bind(this);
        this.handleSearchItemClick = this.handleSearchItemClick.bind(this);

    }

    componentDidMount() {
        let loginTime = window.localStorage.getItem('loginTime');

        if(loginTime == null || 
            loginTime === 'expired' || 
            new Date().getTime() - loginTime >= 3600 * 1000) {
                this.setState({loggedIn: false})
        } else {
            this.setState({loggedIn: true})
        }

    }

    /**
     * Called whenever the user edits the search bar and calls a search artits query
     * to the Spotify Web API
     * @param {*} event - reference to the search bar
     */
    searchArtist(event) {
        let searchText = event.target.value;
        if(searchText === '') {
            console.log("This was called?");
            this.setState({searchResults: []});
            return;
        } 
        // If there's a prev request, abort it
        if (this.prev !== null) {
            this.prev.abort();
        }
        
        // Search for albums who have the typed artist
        // store the current promise in case we need to abort it
        // Limit to 10 to avoid spamming the API with unneeded data
        this.prev = this.spotifyApi.searchAlbums('artist:'+searchText, {limit: 50});

        // This promise is separated to store only the searchQuery part in "this.prev"
        // so that .abort() can be called on it (or else the data type will change)
        this.prev.then(data => {
            this.prev = null;
            this.setState({
                searchResults: data.albums.items
            })

        }).catch(err => console.log(err));
    }

    /**
    * Based on the results stored in state and the current page, display a list of search results
    * The array is sliced to control pagination 
     */
    getSearchResults() {
        return this.state.searchResults.slice((this.state.page * 10) - 10, (this.state.page * 10)).map(searchResult => (
            <AlbumSearchItem searchResult={searchResult} handleSearchItemClick={this.handleSearchItemClick} />
        ));
    }

    // When page 1 is clicked, set the current to page 1 (etc. for each button)
    handlePagination(event) {
        if(event.target.id === 'prevPage') {
            if(this.state.page === 1) return;
            this.setState({page: (this.state.page-1)})
        } else if(event.target.id === 'nextPage') {
            if(this.state.page === 5) return;
            this.setState({page: (this.state.page+1)}) 
        } else {
            this.setState({page: parseInt(event.target.id)});
        }
    }

    /**
     * When a search item is clicked, this will pass the data onto a page for the album page
     * Where the user can view all the tracks of the album and play them
     */
    handleSearchItemClick(albumId) {
        this.props.history.push('/view-album/'+albumId);
    }
    


    render() {
        return this.state.loggedIn ? 
            <div>
                { /* Search bar to search for the artists */ }
                <input 
                    type="text"
                    required
                    name="searchText"
                    onChange={this.searchArtist}
                    className="form-control"
                    placeholder="Simply search for all the albums of the artist your looking for..."
                    style={searchArtistStyle}
                />
                <br />

                <this.getSearchResults /> 

                <div >
                    {
                        this.state.searchResults.length > 0 ?
                            <Pagination style={{'display': 'flex', 'justifyContent': 'center', 'fontSize': '0.7em'}}>
                                <Pagination.Prev id="prevPage" 
                                    onClick={this.handlePagination}/>
                                <Pagination.Item id="1" 
                                    onClick={this.handlePagination}
                                    active={1===this.state.page}>{1}</Pagination.Item>
                                <Pagination.Item id="2" 
                                    onClick={this.handlePagination}
                                    active={2===this.state.page}>{2}</Pagination.Item>
                                <Pagination.Item id="3" 
                                    onClick={this.handlePagination}
                                    active={3===this.state.page}>{3}</Pagination.Item>
                                <Pagination.Item id="4" 
                                    onClick={this.handlePagination}
                                    active={4===this.state.page}>{4}</Pagination.Item>
                                <Pagination.Item id="5" 
                                    onClick={this.handlePagination}
                                    active={5===this.state.page}>{5}</Pagination.Item>
                                <Pagination.Next id="nextPage" 
                                    onClick={this.handlePagination}/>
                            </Pagination>
                        :
                        <div></div>
                    }
                    <br /> <br />
                </div>

                
                   
            </div>
        :
            <DisplayError 
                showError={true} 
                errors={['Please login to gain access the site!']}
            />
    }
}

const searchArtistStyle = {
    'margin': '3px auto',
    'width': '55%'
}

export default HomePage
