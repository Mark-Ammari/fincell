import React from 'react';
import classes from './ErrorWrapper.module.css';

interface ErrorWrapperProps {
    error: boolean,
    message?: string
}

const ErrorWrapper: React.FC<ErrorWrapperProps> = ({ error, message, children }) => {
    return (
        <>
            {error ? <p className={classes.ErrorWrapper}>{message}</p> : children}
        </>
    )
};

export default ErrorWrapper;