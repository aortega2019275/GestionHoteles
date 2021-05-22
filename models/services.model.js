'use strict'

var mongoose = require('mongoose')
var Schema = mongoose.Schema;

var serviceSchema = Schema({
    name: String,
    description: String,
    price: Number
});

module.exports = mongoose.model('service', serviceSchema)