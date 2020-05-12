import React, { Component } from 'react'

// React-Bootstrap components
import Card from 'react-bootstrap/Card'

import './AlbumSearchItem.css';

export class AlbumSearchItem extends Component {

    constructor(props) {
        super(props);

        this.getArtists = this.getArtists.bind(this);
    }

    getArtists() {
        return this.props.searchResult.artists.map(artistData => (
            <li> {artistData.name} </li>
        ));
    }

    

    render() {
        // Use this var to simplify refrencing the props data
        let data = this.props.searchResult;
        return (
            <div style={{padding : '9px 0px 9px 0px', position: 'relative'}}>
                {/* Use a card with its relevant fields to display each album search result */ }
                <Card style={cardStyle} id="searchItem" onClick={this.props.handleSearchItemClick.bind(this, data.id)}>
                    <Card.Body style={{position: 'relative'}}>
                        <Card.Title style={{width: '80%'}}> {data.name} <em> {new Date(data.release_date).toDateString()} </em> </Card.Title>
                            <ul style={{width: '50%'}}><this.getArtists /></ul>
                        <img
                            id="albumImage"
                            alt=""
                            src={data.images[0].url}
                            width="120"
                            height="120"
                            className="d-inline-block align-top"
                            style={albumImageStyle}
                        />
                        <Card.Text style={{'margin': '0px 0px 0px 5px'}}>
                        </Card.Text>
                    </Card.Body>
                    
                </Card>
            </div>
        )
    }
}

const cardStyle = {
 'margin': 'auto',
 'width': '65%'
}

const albumImageStyle = {
    'width': '15%',
    'height': '95%',
    'position': 'absolute',
    'top': '0%',
    'right': '0.5%',
    'margin': '3px 0px 3px 0px'
}

export default AlbumSearchItem
