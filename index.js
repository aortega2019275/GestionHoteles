'use strict'

var mongoose = require('mongoose');
var app = require('./app');
var port = 3800;

mongoose.Promise = global.Promise;
mongoose.set('useFindAndModify', false);
mongoose.connect('mongodb://localhost:27017/AgendaWebPlusBV', {useNewUrlParser: true, useUnifiedTopology: true})
    .then(()=>{
        console.log('Conectado a BD');
        //userInit.createInit();
        app.listen(port, ()=>{
            console.log('Servidor de experss corriendo')
        })
    })

    
    .catch((err)=>console.log('Error al conectase a la BD', err))