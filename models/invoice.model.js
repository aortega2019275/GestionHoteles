'use strict'

var mongoose = require('mongoose')
var Schema = mongoose.Schema

var invoiceSchema = Schema({
    dateGenerate: Date,
    totalPrice: Number,
    reservation: [{type: Schema.ObjectId, ref:"reservation"}]
})

module.exports = mongoose.model('invoice', invoiceSchema)