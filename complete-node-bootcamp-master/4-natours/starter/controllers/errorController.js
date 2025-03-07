const AppError = require('./../utils/appError');

const handleCastErrorDB = err => {
    const message = `Invalid ${err.path}: ${err.value}`;
    return new AppError(message, 400);
};

const handleDuplicateFieldsErrorDB = err => {
    const value = err.errmsg.match(/(["'])(\\?.)*?\1/)[0];
    const message = `Duplicate field value: ${value}. Please use another value`;
    return new AppError(message, 400);
};

const handleValidationErrorDB = err => {
    const errors = Object.values(err.errors).map(el => el.message);
    const value = errors.join('. ');
    const message = `Invalid Input Data: ${value}`;
    return new AppError(message, 400);
};

const handleTokenValidationError = () => new AppError('Invalid Token', 401);

const handleTokenExpirationError = () => new AppError('Token Expired', 403);

const sendErrorDev = (err, res) => {
    res.status(err.statusCode).json({
        status: err.status,
        error: err,
        message: err.message,
        stack: err.stack
    });
};

const sendErrorProd = (err, res) => {
    if (err.isOperational) {
        res.status(err.statusCode).json({
            status: err.status,
            message: err.message
        });
    } else {
        // eslint-disable-next-line no-console
        console.error('Error 💣 ', err);
        res.status(500).json({
            status: 'error',
            message: 'Something went wrong'
        });
    }
};

const sendErrorElse = res => {
    res.status(500).json({
        status: 'error',
        message: 'There is a problem with the server'
    });
};

module.exports = (err, req, res, next) => {
    err.statusCode = err.statusCode || 500;
    err.status = err.status || 'error';

    if (process.env.NODE_ENV === 'development') {
        sendErrorDev(err, res);
    } else if (process.env.NODE_ENV === 'production') {
        let error = { ...err };
        if (error.name === 'CastError') error = handleCastErrorDB(error);
        if (error.code === 1000) error = handleDuplicateFieldsErrorDB(error);
        if (error.name === 'ValidationError')
            error = handleValidationErrorDB(error);
        if (error.name === 'JsonWebTokenError')
            error = handleTokenValidationError(error);
        if (error.name === 'TokenExpiredError')
            error = handleTokenExpirationError(error);

        sendErrorProd(error, res);
    } else {
        sendErrorElse(res);
    }
};
