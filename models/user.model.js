'use strict'

var mongoose = require('mongoose')
var Schema = mongoose.Schema;

var userSchema = Schema({
    name: String,
    lastname: String,
    username: String,
    password: String,
    email: String,
    image: String,
    role: String,
    phone: String,
    age: Date,
    country: String,
    reservations: [{type: Schema.ObjectId, ref: "reservation"}],
    history: [{type: Schema.ObjectId, ref: "hotel"}],
    invoice: [{type: Schema.ObjectId, ref: 'invoice'}]
});

module.exports = mongoose.model('user', userSchema)