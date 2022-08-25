const fs = require('fs');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const Tour = require('./../../models/tourModel');

dotenv.config({ path: './config.env' });

const DB = process.env.DATABASE.replace(
    '<PASSWORD>',
    process.env.DATABASE_PASSWORD
);

mongoose
    .connect(DB, {
        useNewUrlParser: true,
        useCreateIndex: true,
        useFindAndModify: false,
    })
    .then(() => {
        console.log('DB connection sucessful');
    });

// read json file
const tours = JSON.parse(
    fs.readFileSync(
        `${__dirname}/tours-simple.json`,
        'utf-8'
    )
);

// import data into DB
async function importDate() {
    try {
        await Tour.create(tours);
        console.log('Date sucessfuly loaded!');
    } catch (err) {
        console.log(err);
    }
}

// delete all data from collection
const deleteData = async () => {
    try {
        await Tour.deleteMany();
        console.log('Date sucessfuly deleted!');
    } catch (err) {
        console.log(err);
    }
};

console.log(process.argv);
