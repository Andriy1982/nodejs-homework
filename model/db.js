const mongoose = require('mongoose')
require('dotenv').config()
const connectDB=process.env.CONNECT_DB

const db = mongoose.connect(connectDB, {
    useNewUrlParser: true,
    useCreateIndex: true,
    useUnifiedTopology: true,
    useFindAndModify: false,
})

mongoose.connection.on('connected', () => {
    console.log('Mongoose connection to db');
})

mongoose.connection.on('error', (err) => {
    console.log(`Mongoose connection error ${err.message}`);
})

mongoose.connection.on('disconnected', (err) => {
    console.log(`Mongoose disconnected`);
})

process.on('SIGINT', async () => {
    await mongoose.connection.close()
        console.log('Connection for db closed')
        process.exit(1)
    
})

module.exports = db