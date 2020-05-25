import React, { Component } from 'react';
// React-Bootstrap components
import Card from 'react-bootstrap/Card';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';

import './AlbumSearchItem.css';

export class AlbumSearchItem extends Component {
  constructor(props) {
    super(props);

    // bind the functions
    this.getArtists = this.getArtists.bind(this);
  }

  /**
   * Convert the list of artists into a single string
   */
  getArtists = () => {
    return this.props.searchResult.artists.map((artist) => artist.name).join(', ');
  };

  render() {
    // Use this var to simplify refrencing the props data
    let data = this.props.searchResult;
    return (
      <div>
        {/* Use a card with its relevant fields to display each album search result */}
        <Card
          id="searchItem"
          onClick={this.props.handleSearchItemClick.bind(this, data.id)}
        >
          <Card.Body style={{ position: 'relative' }}>
            {/* By using a container with columns, it scales automatically to device */}
            <Container fluid>
              <Row>
                <Col sm={7}>
                  <Card.Title style={{ width: '80%' }}>
                    {/* Output the name of the album as well as its date */}
                    {data.name}
                  </Card.Title>
                  <em> {new Date(data.release_date).toDateString()} </em>
                  <br />
                  <p className="artistsText">
                    <this.getArtists />
                  </p>

                  {/* Get the artists */}
                </Col>

                {/* Get the image on the right hand side */}
                <img
                  id="albumImage"
                  alt=""
                  src={data.images[0].url}
                  width="120"
                  height="120"
                  className="d-inline-block align-top"
                />
              </Row>
            </Container>
          </Card.Body>
        </Card>
      </div>
    );
  }
}

export default AlbumSearchItem;
