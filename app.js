const express = require('express');
const fs = require('fs');
const morgan = require('morgan');

const AppError = require('./utils/appError');
const globalErrorHandler = require('./controllers/errorController');
// LOAD ROUTES 
const tourRouter = require('./routes/tourRoutes');
const userRouter = require('./routes/userRoutes');

// START APP
const app = express();

// MIDDLEWARES
console.log(process.env.NODE_ENV);
if (process.env.NODE_ENV === 'develoment'){
    app.use(morgan('dev'));
}

app.use(express.json()); //add function to the middleware stack
app.use(express.static(`${__dirname}/public`));

app.use((req, res, next) => {
    req.requestTime = new Date().toISOString();
    next();
});

// ROUTES
app.use('/api/v1/tours', tourRouter);
app.use('/api/v1/users', userRouter);

app.all('*', (req, res, next) => {
    next(
        new AppError(
            `Can't find ${req.originalUrl} on this server`,
            404
        )
    );
});


// global error handling middleware
app.use(globalErrorHandler);



module.exports = app;
