import React, { Component } from 'react';

// React-router-dom link
import Link from 'react-router-dom/Link';

// React-Bootstrap components
import Navbar from 'react-bootstrap/Navbar';
import Nav from 'react-bootstrap/Nav';
import Button from 'react-bootstrap/Button';

// Image assets
import logo from '../../assets/my_artists_logo.png';

/*
    The navbar navigation at the top of the page.
    Two different apperances based on whether the user is logged in or not.
    Will keep this a class component for future extensibility
*/
export class MainNavbar extends Component {
  render() {
    return (
      <div>
        {/* Navbar fixed position top. Uses the dark variant UI to give a dark-mode feel. */}
        <Navbar
          collapseOnSelect
          style={{ backgroundColor: '#262a30' }}
          variant="dark"
          fixed="top"
        >
          {/* Display the logo and the website name. Also a button to redirect to home page. */}
          <Link to="/">
            <Navbar.Brand href="#home">
              <img
                alt=""
                src={logo}
                width="30"
                height="30"
                className="d-inline-block align-top"
              />{' '}
              My Artists
            </Navbar.Brand>
          </Link>

          {/* Placeholder: empty on purpose to ensure that the 'login' button is aligned to the right */}
          <Nav className="mr-auto"></Nav>

          {!this.props.loggedIn ? (
            <Nav>
              {/* Link on navbar to redirect to the login page*/}
              <Button variant="outline-success" href="/spotify-login">
                Login to Spotify
              </Button>
            </Nav>
          ) : (
            <Link to="/my-history">
              {' '}
              <Button variant="success"> {this.props.displayName} </Button>{' '}
            </Link>
          )}
        </Navbar>
      </div>
    );
  }
}

export default MainNavbar;
