'use strict'

var express = require('express');
var bodyParser = require('body-parser');
var cors = require('cors');
var allRoutes = require('./routes/all.routes');


var app = express();

app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json())

app.use(cors())

app.use('/api', allRoutes);

module.exports = app;