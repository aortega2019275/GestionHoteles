'use strict'

var mongoose = require('mongoose')
var Schema = mongoose.Schema

var hotelSchema = Schema({
    name: String,
    address: String,
    requestHotel: Number,
    phone: String,
    country: String,
    image: String,
    idAdminHotel: String,
    room: [{type: Schema.ObjectId, ref: "room"}],
    event: [{type: Schema.ObjectId, ref:"event"}],
    reservation: [{type: Schema.ObjectId, ref:'reservation'}]
})

module.exports = mongoose.model('hotel', hotelSchema)