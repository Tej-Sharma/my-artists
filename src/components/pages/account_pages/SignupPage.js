import React, { Component } from 'react'

// React-router-dom link
import Link from 'react-router-dom/Link';

// React-Bootstrap components
import Form from 'react-bootstrap/Form';
import FormControl from 'react-bootstrap/FormControl';
import Button from 'react-bootstrap/Button';

/*
    The signup page. Handles creating a new account, then loggin in the  user, and redirecting to the main page.
*/
export class SignupPage extends Component {

    /*
        Sets up the desired state fields needed for signup: 3 properties
    */
    constructor(props) {
        super(props);

        this.state = {
            newEmail: '',
            newPassword: '',
            newRepeatPassword: '',
        }

         // Bind functions with this one-time to ensure that they have access to the classes properties
        // such as this.setState(), for example
        this.handleUIChange = this.handleUIChange.bind(this);
    }

    /*
        Handle the submission of the sign up form. If valid credentials, create the account, and redirect the user.
        Otherwise, display an error message.
        As mentioned below, validations are handled within the UI through the mentioned properties
    */
   handleLogin(event) {

    }    

    /*
        Update the stored state's properties.
        @event - The reference to the UI component.
                 The name property of the UI component will correspond to a property in the state
                 i.e., for the signup email field, the name is 'newEmail'
    */
    handleUIChange(event) {
        
    }

    render() {
        return (
            <div> 
                {/* Form container for UI fields to handle account creation. */}
                <Form className="container">
                    
                    {/* The email GUI input field */}
                    <Form.Group controlId="emailField">
                        <Form.Label>Email address</Form.Label>
                        <Form.Control type="email" placeholder="Enter email" required />
                        <Form.Text className="text-muted">
                            Your email will be used only for authentication purposes :)
                        </Form.Text>
                    </Form.Group>


                    {/* The password GUI input field */}
                    <Form.Group controlId="passwordField">
                        <Form.Label>Password</Form.Label>
                        <Form.Control type="password" placeholder="Password" required />
                    </Form.Group>

                    {/* 
                        The repeat password GUI input field. Repeat the password in place to ensure the user enters
                        the password correctly both time.
                    */}
                    <Form.Group controlId="repeatPasswordField">
                        <Form.Label>Repeat Password</Form.Label>
                        <Form.Control type="password" placeholder="Repeat Password" required />
                    </Form.Group>

                    {/* Button that handles the submission of the form */}
                    <Button variant="primary" type="submit">
                        Create my account
                    </Button>

                    <br />

                </Form> 
            </div>
        )
    }
}

export default SignupPage
