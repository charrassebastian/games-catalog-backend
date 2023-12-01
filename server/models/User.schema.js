const mongoose = require('mongoose')
const { Schema } = mongoose

const User = new Schema({
    "username": { type: String, require: true, unique: true },
    "password": { type: String, require: true }
})

module.exports = mongoose.model('User', User)