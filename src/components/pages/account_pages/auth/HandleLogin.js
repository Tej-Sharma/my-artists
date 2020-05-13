import React, { Component } from 'react'

/**
 * Loaded when the auth-server backend is done with authentication and calls
 * this front end component to finish up authentication by storing
 * the auth token
 */
export class HandleLogin extends Component {
    
    // Store tokens in the state
    constructor(props) {
        super(props);

        this.state = {
            // Store the tokens from the params. Replace is called to remove the string fields
            // and store only the code part
            aToken: this.props.match.params.atoken.replace('access_token=', ''),
            rToken: this.props.match.params.rtoken.replace('refresh_token=', '')
        }

    }

    // Store tokens in local storage and then redirect to the main page
    componentDidMount() {
        // Handle App.js login
        this.props.loginUser(this.state.aToken, this.state.rToken)
        
        // Load the home page and reload to sync the tokens
        this.props.history.push('/');
        window.location.reload(true);
    }

    /**
     * No rendering is needed
     */
    render() {
        return (
            <div>
            </div>
        )
    }
}

export default HandleLogin
