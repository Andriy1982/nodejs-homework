const {MongoClient} = require('mongodb')
require('dotenv').config()
const connectDB=process.env.CONNECT_DB

const db = MongoClient.connect(connectDB, {
    useUnifiedTopology: true,
    poolSize: 5,
})

process.on('SIGINT', async () => {
    const client = await db
    client.close()
    console.log('Connection for db closed')
    process.exit(1)
})

module.exports = db