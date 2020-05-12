import React from 'react'

import Alert from 'react-bootstrap/Alert';

/**
* If there are any error messages or errors due to validations, this function will display an alert
*/
const DisplayError = (props) => {
    return props.showError ?
        // Errors present in the form: display alert to user
        <Alert variant='danger' style={alertStyle}>
                {
                    props.errors.map((errorTxt) => (
                        <li> {errorTxt} </li>
                    ))
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
    'margin': '5px 10px 12px 10px' // Margin to accomdate mobile as well
}

export default DisplayError;
