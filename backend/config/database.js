const mongoose = require('mongoose');

const database = async() => {
    try {
        await mongoose.connect(process.env.MONGODB_URI, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        });
        console.log('Connection to database established.');
    }
    catch(err) {
        console.error(err.message);
        console.error('Unable to connect to the database');
    }
}

module.exports = database;