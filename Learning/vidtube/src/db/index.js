
const mongoose = require('mongoose');
const DB_NAME = require('../constants');

const connectDB = async () =>{
    try {
      const connectionInstance =  await mongoose.connect(`${process.env.MONGODB_URL}/${DB_NAME}`)
      console.log( `\n MongoDB connected  ! DB host: ${connectionInstance.connection.host}`);
    } catch (err) {
        console.log('MongoDB Connection error', err);
        process.exit(1)
    }
}

module.exports = connectDB;