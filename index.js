const express = require('express')
const app = express()
const cors = require('cors')
const mongoose = require('mongoose')
const { router } = require('./routes')

require('dotenv').config()
app.use(express.json())
app.use(cors())
app.use(router)

/**
 * Function for establishing the connection to the database. The parameters come from a .env file
 */
const run = async () => {
    const user = process.env.DB_USER
    const password = process.env.DB_PASSWORD
    const ip = process.env.DB_IP
    const port = process.env.DB_PORT
    const dbName = process.env.DB_NAME
    const uri = `mongodb://${ip}:${port}/${dbName}`
    await mongoose.connect(uri, {
        authSource: "admin",
        user,
        pass: password,
        useNewUrlParser: true,
        useUnifiedTopology: true,
    })
    mongoose.connection.once('open', () => {
        console.log('MongoDB successfully connected to ' + uri)
    })
}

if (require.main === module) {
    const port = process.env.NODE_PORT ?? 8080
    // now it must connect to the database
    run()
    app.listen(port, () => console.log('Listening on port ' + port))
}
module.exports.app = app