const express = require('express');
const app = express();
const morgan = require('morgan');
const crud = require('./crud');
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

// Routes
app.route(`/api/v${apiVersion}/tours`)
    .get(crud.getAllTours)
    .post(crud.createNewTour);

app.route(`/api/v${apiVersion}/tours/:id`)
    .get(crud.getTour)
    .patch(crud.updateTour)
    .delete(crud.deleteTour);

// Server
const port = 3000;
app.listen(port, () => {
    console.log(`App running on port ${port}...`);
});
