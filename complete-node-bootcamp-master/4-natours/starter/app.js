const express = require('express');

const app = express();
const morgan = require('morgan');
const apiDocRouter = require('./routes/apiDocRoutes');
const tourRouter = require('./routes/tourRoutes');
const userRouter = require('./routes/userRoutes');
const globalErrorHandler = require('./controllers/errorController');
const appError = require('./utils/appError');

const apiVersion = 1;
app.use(express.json());
app.use(express.static(`${__dirname}/public`));

// custom middleware
app.use((req, res, next) => {
    // console.log('Hello from the middleware 👋');
    next();
});
app.use((req, res, next) => {
    req.requestTime = new Date().toISOString();
    next();
});

if (process.env.NODE_ENV === 'development') {
    app.use(morgan());
}

// Routes Middleware
app.use(`/api`, apiDocRouter);
app.use(`/api/v${apiVersion}/tours`, tourRouter);
app.use(`/api/v${apiVersion}/users`, userRouter);

app.all(`/api/*`, (req, res, next) => {
    next(
        new appError.AppError(
            `The URL path ${req.originalUrl} was not found`,
            404
        )
    );
});

//
// ERROR HANDLING FUNCTION
app.use(globalErrorHandler);

module.exports = app;
