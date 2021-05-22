'use strict'

var mongoose = require('mongoose');
var app = require('./app');
var user = require('./controllers/user.controller')
var port = 3800;

mongoose.Promise = global.Promise;
mongoose.set('useFindAndModify', false);
mongoose.connect('mongodb://localhost:27017/GestiondeHotelesG4', {useNewUrlParser: true, useUnifiedTopology: true})
    .then(()=>{
        user.initAdmin();
        console.log('connect to DB');
        app.listen(port, ()=>{
            console.log('server express running')
        })
    }).catch((err)=>console.log('connection error to DB', err))