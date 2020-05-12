import React, { Component } from 'react'

export class HandleLogin extends Component {
    
    // Store tokens in the state
    constructor(props) {
        super(props);

        this.state = {
            aToken: this.props.match.params.atoken.replace('access_token=', ''),
            rToken: this.props.match.params.rtoken.replace('refresh_token=', '')
        }

    }

    // Store tokens in local storage and then redirect to the main page
    componentDidMount() {
        this.props.loginUser(this.state.aToken, this.state.rToken)
        this.props.history.push('/');
    }

    render() {
        return (
            <div>
                <p> Hehe login handled! </p>
            </div>
        )
    }
}

export default HandleLogin
