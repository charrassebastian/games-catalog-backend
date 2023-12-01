const express = require('express')
const app = express()
const cors = require('cors')
app.use(cors({
    origin: '*',
    credentials: true,
}));
app.use(express.json())
const { router } = require('./routes')
app.use(router)
const mongoose = require('mongoose')
require('dotenv').config()

/**
 * Function for establishing the connection to the database. The parameters come from a .env file
 */
const run = async () => {
    let uri;
    if(process.env.DB_URI?.length){
        uri = process.env.DB_URI
        await mongoose.connect(uri)
    } else {
        const user = process.env.DB_USER
        const password = process.env.DB_PASSWORD
        const ip = process.env.DB_IP
        const port = process.env.DB_PORT
        const dbName = process.env.DB_NAME
        uri = `mongodb://${ip}:${port}/${dbName}`
        await mongoose.connect(uri, {
            authSource: "admin",
            user,
            pass: password,
            useNewUrlParser: true,
            useUnifiedTopology: true,
        })
    }
    mongoose.connection.once('open', () => {
        console.log('Conectado con base de datos MongoDB exitosamente')
    })
}

if (require.main === module) {
    const port = process.env.NODE_PORT ?? 8080
    // now it must connect to the database
    run()
    app.listen(port, () => console.log('Escuchando al puerto ' + port))
}
module.exports.app = app
