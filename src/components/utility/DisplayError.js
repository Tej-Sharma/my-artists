import React from 'react'

import Alert from 'react-bootstrap/Alert';

/**
* If there are any error messages or errors due to validations, 
* this simple function will display an alert
*/
const DisplayError = (props) => {
    return props.showError ?
        <Alert variant='danger' style={alertStyle}>
            {
                props.errors
            }
        </Alert>
    :
        <div>
            {/* No errors. Return nothing */}
        </div>
}

// Simple style for the alert
const alertStyle = {
    'fontSize': '0.8em',
    'margin': '7px 15px 12px 15px' // Margin to accomdate mobile as well
}

export default DisplayError;
