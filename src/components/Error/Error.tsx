import React from 'react';

interface ErrorProps {
    error: unknown;
}

const Error: React.FC<ErrorProps> = ({ error }) => {
    console.log(error);

    if (!error) {
        return null;
    }

    let errorMessage = 'An error has occurred';

    if (typeof error === 'object' && error !== null) {
        const err = error as {
            response?: { status?: number; data?: string };
            message?: string;
        };
        if (err.response && err.response.status === 404) {
            errorMessage = err.response.data || errorMessage;
        } else {
            errorMessage = err.message || errorMessage;
        }
    } else if (typeof error === 'string') {
        errorMessage = error;
    }

    return (
        <div className="notification is-danger">
            <p>{errorMessage}</p>
        </div>
    );
};

export default Error;
