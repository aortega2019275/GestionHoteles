'use strict'

var mongoose = require('mongoose')
var Schema = mongoose.Schema

var eventSchema = Schema({
    name: String,
    description: String,
    typeEvent: String,
    dateEvent: Date
})

module.exports = mongoose.model('event', eventSchema)