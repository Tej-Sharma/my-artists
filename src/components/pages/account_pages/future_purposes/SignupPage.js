import React, { Component } from 'react'

// React-Bootstrap components
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';

// Import only the required firebase backend services
import * as firebase from "firebase/app";
import "firebase/auth";
import "firebase/firestore";

// Other components
import DisplayError from "../../../utility/DisplayError";

/**
 *  NOTE: NOT USED by the web app, but, for future extensibility and demonstration of how 
 *  to sign up and create a user through the Firebase backend, it has been included here
 *  The signup page. Handles creating a new account, then loggin in the  user, and redirecting to the main page.
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
            showError: false, // if there are any current errors
            errors: [], // store the errors that need to be displayed to the user,
            createingAcc: false, // handle loading display
        }

         // Bind functions one-time to ensure that they have access to the classes properties such as this.setState()
        this.handleUIChange = this.handleUIChange.bind(this);
        this.handleSignup = this.handleSignup.bind(this);

    }


   /**
    * Handle the submission of the sign up form. If valid credentials, create the account, and redirect the user.
    *    Otherwise, display an error message.
    *    As mentioned below, validations are handled within the UI through the mentioned properties
    * @param {*} event - the reference to the event triggered by the form 
    */
    handleSignup(event) {
        // Ensure that the default HTML behaviour doesn't occur to make it responsive
        event.preventDefault();
        // Set loading and reset errors
        this.setState({createingAcc: true, showError: false, errors: []}); 


        // Validation: ensure passwords match and display an error if they do  not
        if(this.state.newPassword != this.state.newRepeatPassword) {
            this.setState({showError: true, errors: this.state.errors.concat("Passwords must match")})
            return; // Exit the function
        }

        // Register the user in the firebase backend if the above test was passed
        firebase.auth().createUserWithEmailAndPassword(this.state.newEmail, this.state.newPassword)
        .then(result => {
            // Successful authentication -> redirect to the home page
            this.props.history.push('/');
        }).catch(error => {
            // Validation: used to catch duplicate emails in user database 
            // There was an error in account creation (i.e., the email is already in use)
            
            // Display the error to the user by updating the component's state and set loading state to false
            this.setState({showError: true, errors: this.state.errors.concat(error.message), createingAcc: false})
          });
    }

   /**
    *  Update the stored state's properties 
    *    (slight repetition of code between login, but since it is just 1 line and the app is not big, should suffice)
    * @param {*} event - The reference to the UI component.
    *             The name property of the UI component will correspond to a property in the state
    *             i.e., for the signup email field, the name is 'newEmail'
    */
    handleUIChange(event) {
        // Retrieve the name and the value from the UI field and update the state accordingly with it
        // "showError: false", close the error alert when new input entered
        this.setState({[event.target.name]: event.target.value, showError: false});        
    }

    render() {
        return (
            <div>

                {/* To display errors. Pass the relevant props to facilitate it */ }
                <DisplayError  showError={this.state.showError} errors={this.state.errors} />

                {/* 
                    Form container for UI fields to handle account creation. 
                    Validations: handled through the required, minlength and maxlength properties
                                 Using a redundant email and other validations in "handleSignup"
                                 and error shown through the alert 
                */}
                <Form className="container" onSubmit={this.handleSignup}>
                    
                    {/* The email GUI input field */}
                    <Form.Group controlId="emailField">
                        <Form.Label>Email address</Form.Label>
                        <Form.Control type="email" placeholder="Enter email" required minLength="5" maxLength="30" 
                            name="newEmail" onChange={this.handleUIChange} />
                        <Form.Text className="text-muted">
                            Your email will be used only for authentication purposes :)
                        </Form.Text>
                    </Form.Group>


                    {/* The password GUI input field */}
                    <Form.Group controlId="passwordField">
                        <Form.Label>Password</Form.Label>
                        <Form.Control type="password" placeholder="Password" required minlength="5" maxlength="20"
                                    name="newPassword" onChange={this.handleUIChange} />
                    </Form.Group>

                    {/* 
                        The repeat password GUI input field. Repeat the password in place to ensure the user enters
                        the password correctly both time.
                    */}
                    <Form.Group controlId="repeatPasswordField">
                        <Form.Label>Repeat Password</Form.Label>
                        <Form.Control type="password" placeholder="Repeat Password" required minlength="5" maxlength="20"
                                name="newRepeatPassword" onChange={this.handleUIChange} />
                    </Form.Group>

                    {/* Button that handles the submission of the form */}
                    <Button variant="primary" type="submit"
                            disabled={this.state.createingAcc} > 
                         {this.state.createingAcc ? 'Processing...' : 'Create my account'}
                    </Button>

                    <br />

                </Form> 
            </div>
        )
    }
}

export default SignupPage
