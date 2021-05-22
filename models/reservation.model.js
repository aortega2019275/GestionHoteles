"use strict";

var mongoose = require("mongoose");
var Schema = mongoose.Schema;

var reservationSchema = Schema({
  start: Date,
  end: Date,
  totalPrice: Number,
  user: [{ type: Schema.ObjectId, ref: "user" }],
  hotel: [{ type: Schema.ObjectId, ref: "hotel" }],
  room: [{ type: Schema.ObjectId, ref: "room" }],
  service:[{ type: Schema.ObjectId, ref: "service" }],
});

module.exports = mongoose.model('reservation', reservationSchema)