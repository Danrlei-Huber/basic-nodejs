const AppError = require("../utils/appError");

const handleCastErrorDB = err => {
    const message = `Invalid ${err.path}: ${err.value}`;

    return new AppError(message, 400);
};

const handleDuplicateFieldsDB = err => {
    const message = `Duplicate field value`;

    return new AppError(message, 400);
};

const handleValidationErrorDB = err => {
    const errors = Object.values(err.errors).map(el => el.message);
    const message = `Invalid input data: ${errors.join('.  ')}`;

    return new AppError(message, 400);
};


const sendErrorDev = (err, res) => {
    res.status(err.statusCode).json({
        status: err.status,
        error: err,
        message: err.message,
        stack: err.stack,
    });
};

const sendErrorProd = (err, res) => {
    // operrational, trusted send message to client
    if (err.isOperational) {
        res.status(err.statusCode).json({
            status: err.status,
            message: err.message,
        }); 
        
    // programing or other unknown error: don't leak error details
    } else {
        // 1) log error
        console.error('error !!!', err);

        // 2) send generic message
        res.status(500).json({
            status: 'error',
            message: 'Something went very wrong !!'
        });
    }
};

module.exports = (err, req, res, next) => {
    err.statusCode = err.statusCode || 500;
    err.status = err.status || 'error';

    if (process.env.NODE_ENV === 'develoment') {
        sendErrorDev(err, res);
    } else if (process.env.NODE_ENV === 'production') {
        let error = { ...err };
        //nao da para usar error por que ele é 
        //undefined quando o if é executado
        if (err.name === 'CastError') {
            error = handleCastErrorDB(error);
        }

        if (err.code === 11000) {
            error = handleDuplicateFieldsDB(error);
        }

        if (err.name === 'ValidationError') {
            error = handleValidationErrorDB(error);
        }

        sendErrorProd(error, res);
    } 
};
 