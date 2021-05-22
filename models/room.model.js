'use strict'

var mongoose = require('mongoose')
var Schema = mongoose.Schema

var roomSchema = Schema({
    name: String,
    available: String,
    price: Number
})

module.exports = mongoose.model('room', roomSchema);