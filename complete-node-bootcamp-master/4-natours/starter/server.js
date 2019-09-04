const mongoose = require('mongoose');
const dotenv = require('dotenv');
const app = require('./app');

process.on('uncaughtException', err => {
    // eslint-disable-next-line no-console
    console.log('UNCAUGHT EXCEPTION... shutting down');
    // eslint-disable-next-line no-console
    console.error(err.name, err.message);
    process.exit(1);
});

dotenv.config({ path: './config.env' });
// console.log(process.env.NODE_ENV);

// Connecting to the project's Database on MongoDB Atlas
const DB = process.env.DATABASE.replace(
    '<PASSWORD>',
    process.env.DATABASE_PASSWORD
);
mongoose
    .connect(DB, {
        useNewUrlParser: true,
        useCreateIndex: true,
        useFindAndModify: false
    })
    .then(() => {
        // console.log('DB connected');
    });

// Server
const port = process.env.PORT || 3000;
const server = app.listen(port, () => {
    // console.log(`App running on port ${port}...`);
});

process.on('unhandledRejection', err => {
    // eslint-disable-next-line no-console
    console.error(err.name, err.message);
    // eslint-disable-next-line no-console
    console.log('UNHANDLED REJECTION... shutting down');
    server.close(() => {
        process.exit(1);
    });
});
