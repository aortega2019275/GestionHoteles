'use strict'

var express = require('express');
var userController = require('../controllers/user.controller');
var hotelController = require('../controllers/hotel.controller');
var serviceController = require('../controllers/services.controller')
var roomController = require('../controllers/room.controller');
var eventController = require('../controllers/event.controller');
var mdAuth = require('../middlewares/authenticated');

var connectMultiparty = require('connect-multiparty');
var mdUpload = connectMultiparty({ uploadDir: './uploads/users'});


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
api.get('/getServices', [mdAuth.ensureAuth, mdAuth.ensureAuthAdmin], serviceController.getServices)
api.post('/createService',  [mdAuth.ensureAuth, mdAuth.ensureAuthAdmin], serviceController.createService)
api.put('/updateService/:id', [mdAuth.ensureAuth, mdAuth.ensureAuthAdmin], serviceController.updateService)
api.put('/deleteService/:id', [mdAuth.ensureAuth, mdAuth.ensureAuthAdmin],  serviceController.deleteService)


//Room
api.get('/getRooms', [mdAuth.ensureAuth, mdAuth.ensureAuthAdmin], roomController.getRooms)
api.get('/getRoom/:id', [mdAuth.ensureAuth, mdAuth.ensureAuthAdmin], roomController.getRoom)
api.put('/setRoom/:id', [mdAuth.ensureAuth, mdAuth.ensureAuthAdmin], roomController.setRoom)
api.put('/:idH/updateRoom/:idR', [mdAuth.ensureAuth, mdAuth.ensureAuthAdmin], roomController.updateRoom)
api.put('/:idH/deleteRoom/:idR', [mdAuth.ensureAuth, mdAuth.ensureAuthAdmin], roomController.deleteRoom)

//Reservation

//invoice

//Hotel
api.get('/getHotels', hotelController.getHotels)
api.post('/createHotel',  hotelController.createHotel)
api.put('/updateHotel/:id', [mdAuth.ensureAuth, mdAuth.ensureAuthAdmin], hotelController.updateHotel)
api.put('/removeHotel/:id', [mdAuth.ensureAuth, mdAuth.ensureAuthAdmin], hotelController.deleteHotel)

//Event
api.put('/setEvent/:id', [mdAuth.ensureAuth, mdAuth.ensureAuthAdmin], eventController.setEvent);
api.put('/:idH/updateEvent/:idE', [mdAuth.ensureAuth, mdAuth.ensureAuthAdmin], eventController.updateEvent);
api.get('/getEvents', [mdAuth.ensureAuth, mdAuth.ensureAuthAdmin], eventController.getEvents)
api.get('/getEvent/:id', [mdAuth.ensureAuth, mdAuth.ensureAuthAdmin], eventController.getEvent)
api.put('/:idH/deleteEvent/:idE', [mdAuth.ensureAuth, mdAuth.ensureAuthAdmin], eventController.deleteEvent)





api.put('/:id/uploadImage', [mdAuth.ensureAuth, mdUpload], userController.uploadImage);
api.get('/getImage/:fileName', [ mdUpload], userController.getImage);

module.exports = api;