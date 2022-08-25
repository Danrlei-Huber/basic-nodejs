const mongoose = require('mongoose');
const dotenv = require('dotenv');
dotenv.config({ path: './config.env' });
const app = require('./app');

process.on('uncaughtException', (err) => {
    console.log('UNCAUGHT EXEPTION !!!!');
    console.log(err.name, err.message);
    process.exit(1);
});

const DB = process.env.DATABASE.replace('<PASSWORD>', process.env.DATABASE_PASSWORD);

mongoose.connect(DB, {
    useNewUrlParser: true,
    useCreateIndex: true,
    useFindAndModify: false
}).then(() => {console.log('DB connection sucessful');});


const port = process.env.PORT || 3000;
const server = app.listen(port, () => {
    console.log(`app running on port ${port}......`);
});

process.on('unhandledRejection', err => {
    console.log('UNHANDLER REJECTION !!!!');
    console.log(err.name, err.message);
    server.close(() => {
        process.exit(1);
    });
});

