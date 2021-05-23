'use strict'

var express = require('express');
var userController = require('../controllers/user.controller');
var mdAuth = require('../middlewares/authenticated');

var api = express.Router();

//User
api.get('/getUsers', [mdAuth.ensureAuth, mdAuth.ensureAuthAdmin], userController.getUsers)
api.get('/getUser/:id', [mdAuth.ensureAuth, mdAuth.ensureAuthAdmin], userController.getUser)
api.post('/register', userController.register)
api.post('/login', userController.login)
api.post('/createUserAdminHotel', [mdAuth.ensureAuth, mdAuth.ensureAuthAdmin], userController.createUserAdminHotel)
api.put('/updateUser/:id', mdAuth.ensureAuth, userController.updateUser)
api.put('/deleteUser/:id', mdAuth.ensureAuth, userController.removeUser)

//Service

//Room

//Reservation

//invoice

//Hotel

//Event



module.exports = api;