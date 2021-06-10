'use strict'

var Hotel = require('./../models/hotel.model');
var bcrypt = require('bcrypt-nodejs')


function getHotels(req, res){
        Hotel.find({}).populate('event','room').exec((err, hotelsFound) => {
            if(err){
                return res.status(500).send({message: "Error al realizar la busqueda de hoteles"})
            }else if (hotelsFound){
                return res.send({message: "Busqueda éxitosa, hoteles encontrados", hotelsFound})
            }else{
                return res.status(204).send({message: "Busqueda fallida, no se encontro ningún resultado"})
            }
        })
}

function createHotel(req, res){
    var hotel = new Hotel();
    var params = req.body;

    if(params.name && params.address && params.phone){
        Hotel.findOne({name: params.name},(err, userFind)=>{
            if(err){
                return res.status(500).send({message: "No se encontró ningún resultado compatible, verifica los datos he intenta de nuevo"});
            }else if(userFind){
                return res.send({message: "El nombre de hotel está en uso, intenta con otro"});
            }else{
                hotel.name = params.name;
                hotel.address = params.address;
                hotel.requestHotel = 0;
                hotel.country = params.country;
                hotel.admin = params.idAdminHotel;
                hotel.phone = params.phone;
                hotel.save((err,hotelSaved)=>{
                    if(err){
                        return res.status(500).send({message: "Error al guardar hotel, intenta de nuevo más tarde"});
                    }else if(hotelSaved){
                        return res.send({message: "Hotel registrado satisfactoriamente", hotelSaved});
                    }else{
                        return res.status(500).send({message: "Hotel no registrado"});
                    }
                })      
            }
        })
    }else{
    return res.status(401).send({message: "Por favor llene todos los campos obligatorios para poder registrar un hotel: Nombre, Dirección, País"})
    }
}

function updateHotel(req, res){
    var hotelId = req.params.id;
    var update = req.body;
    
    if(hotelId){
        Hotel.findByIdAndUpdate(hotelId, update, {new: true}, (err, hotelUpdated) => {
            if(err){
                return res.status(500).send({message: "Error al intentar actualizar la información del hotel"})
            }else if(hotelUpdated){
                return res.send({message: "Hotel actualizado exitosamente", hotelUpdated})
            }else{
                return res.status(404).send({message: "No se pudo actualizar la información del hotel"})
            }
        })
    }else{
        return res.status(404).send({message: "No posees permisos necesarios para realizar esta acción"})
    }
}


function deleteHotel(req, res){
    var hotelId = req.params.id;
    var password = req.body.password;

    if(hotelId && password){
        if(req.user.role === "ROLE_ADMIN"){
            User.findById(req.user.sub, (err, userFound) => {
                if(err){
                    return res.status(500).send({message: "No se encontró ningún resultado compatible, verifica los datos he intenta de nuevo"})
                }else if(userFound){
                    bcrypt.compare(password, userFound.password, (err, checkPassword) => {
                        if(err){
                            return res.status(500).send({message: "Error al comparar las contraseñas, verifica e intenta de nuevo"})
                        }else if(checkPassword){
                            Hotel.findByIdAndRemove(hotelId, (err, hotelRemoved) => { 
                                if(err){
                                    return res.status(500).send({message: "Error al intentar eliminar el hotel"})
                                }else if(checkPassword){
                                    return res.send({message: "Hotel eliminado exitosamente", hotelRemoved: hotelRemoved})
                                }else{
                                    return res.status(404).send({message: "El hotel no fue eliminado"})
                                }
                            })
                        }else{
                            return res.status(400).send({message: "Las contraseñas no coinciden, verifica e intenta de nuevo"})
                        }
                    })
                }else{
                    return res.status(204).send({message: "Usuario no encontrado"})
                }
            })
        }else{
            return res.status(404).send({message: "No posees permisos necesarios para realizar esta acción"})
        }
    }else{
        return res.status(404).send({message: "Por favor ingrese los parametros minimos de Uri y Body"})
    }
}




module.exports = {
    getHotels,
    createHotel,
    updateHotel,
    deleteHotel
}