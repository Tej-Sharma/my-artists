import React, { Component } from 'react'

// React-router-dom link to handle redirection of the user to the desired page-componenet
import Link from 'react-router-dom/Link';

// React-Bootstrap components
import Form from 'react-bootstrap/Form';
import FormControl from 'react-bootstrap/FormControl';
import Button from 'react-bootstrap/Button';

// Style sheet for the login page
import LoginStyle from './LoginStyle.css';

// Other components
import DisplayError from "../../../utility/DisplayError";

import * as firebase from "firebase/app";
import "firebase/auth";
import "firebase/firestore";

/**
 *     The login page. Handles authentication and redirection of the user to home page with authentication.
 */
export class LoginPage extends Component {

    /*
        Sets up the desired state fields needed for login: 2 properties
    */
    constructor(props) {
        super(props);

        this.state = {
            emailInput: '',
            passwordInput: '',
            showError: false, // show login error
            errors: [],  // store the error(s)
            loggingIn: false, // control loading
        }

        // Bind functions with this one-time to ensure that they have access to the classes properties
        // such as this.setState(), for example
        this.handleUIChange = this.handleUIChange.bind(this);
        this.handleLogin = this.handleLogin.bind(this);
    }

    /**
    *   Handle the submission of the login form. If successful authentication, redirect the user.
    *    Otherwise, display an error message.
    *    As mentioned below, validations are handled within the UI through 'required
    * @param {*} event - reference to the form
    */
    handleLogin(event) {
        // Prevent unwanted html behaviour
        event.preventDefault();
        // set to be loading and reset errors
        this.setState({loggingIn: true, showError: false, errors: []});
        
        firebase.auth().signInWithEmailAndPassword(this.state.emailInput, this.state.passwordInput)
        .then(result => {
            // Successful login -> redirect to home page
            this.props.history.push('/');
        }).catch(error => {
            // Login error -> add it to state for it to be displayed
            this.setState({
                loggingIn: false, 
                showError: true, 
                errors: this.state.errors.concat(error.message)
            })
        });
    }

    /** 
     * Update the stored state's properties
     * @event - The reference to the UI component.
                The name property of the UI component will correspond to a property in the state
                i.e., for the signup email field, the name is 'newEmail'
    */
    handleUIChange(event) {
        // Retrieve the name and the value from the UI field and update the state accordingly with it
        // Close error box as well
        this.setState({[event.target.name]: event.target.value, showError: false});
    }

    render() {
        return (
            <div>
                
                 {/* To display error on invalid login. Pass the relevant props to facilitate it */ }
                 <DisplayError  showError={this.state.showError} errors={this.state.errors} />

                {/* 
                    Form container. Contains the login fields: email and password. 
                    On submit, call the handleLogin function.

                    Validations: non-empty fields needed are handled through the 'required' property
                */}
                <Form className="container" onSubmit={this.handleLogin}>
                    
                    {/* The email GUI input field with name 'emailInput' and a text label */}
                    <Form.Group controlId="emailField">
                        <Form.Label>Email address</Form.Label>
                        <Form.Control type="email" placeholder="Enter email" required
                                      name="emailInput" onChange={this.handleUIChange} />
                        <Form.Text className="text-muted">
                        </Form.Text>
                    </Form.Group>

                    {/* The password GUI input field with name 'passwordInput* and a text label */}
                    <Form.Group controlId="passwordField">
                        <Form.Label>Password</Form.Label>
                        <Form.Control type="password" placeholder="Password" required
                                      name="emailInput" onChange={this.handleUIChange} />
                    </Form.Group>

                    {/* Button that handles the submission of the form through type="submit" */}
                    <Button variant="primary" type="submit" disabled={this.state.loggingIn}>
                        {this.state.loggingIn ? 'One sec...' : 'Login'}
                    </Button>
                    <br />
                    
                    {/* The email UI input field */}
                    <Link to="/signup"> <em> Need an account? Create one for free! </em> </Link>
                </Form>                                
            </div>
        )
    }
}

const tableStyle = {

}

export default LoginPage
