const express = require('express');
const app = express();
const morgan = require('morgan');
const tourRouter = require('./routes/tourRoutes');
const userRouter = require('./routes/userRoutes');
const apiVersion = 1;
app.use(express.json());

// custom middleware
app.use((req, res, next) => {
    console.log('Hello from the middleware 👋');
    next();
});
app.use((req, res, next) => {
    req.requestTime = new Date().toISOString();
    next();
});
app.use(morgan());

// Routes Middleware
app.use(`/api/v${apiVersion}/tours`, tourRouter);
app.use(`/api/v${apiVersion}/users`, userRouter);

// Server
const port = 3000;
app.listen(port, () => {
    console.log(`App running on port ${port}...`);
});
