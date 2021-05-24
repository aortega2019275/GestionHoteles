'use strict'

var Room = require('./../models/room.model');
var Hotel = require('./../models/hotel.model');


function getRooms(req, res){
    Room.find({}).exec((err, roomsFound) => {
        if(err){
            return res.status(500).send({message: "Error ocurrido durante la busqueda, intente de nuevo"})
        }else if(roomsFound){
            return res.send({message: "Hemos encontrado habitaciones exitosamente", roomsFound})
        }else{
            return res.status(404).send({message: "No encontramos habitaciones que coincidan"})
        }
    }).populate('room')
}

function getRoom(req, res){
    var roomId = req.params.id;

    if(req.user.role === "ROLE_ADMIN"){
        Room.findById(roomId).exec((err, roomFound) => {
            if(err){
                return res.status(500).send({message: "Error ocurrido durante la busqueda, intente de nuevo"})
            }else if(roomFound){
                return res.send({message: "Hemos encontrado la habitación exitosamente", roomFound})
            }else{
                return res.status(404).send({message: "Habitación inxistente"})
            }
        })
    }else{  
        return res.status(404).send({message: "No posees permisos necesarios para realizar esta acción"})
    }

}

function setRoom(req, res){
    var hotelId = req.params.id;
    var params = req.body;
    var room = new Room();
        Hotel.findById(hotelId, (err, hotelFind)=>{
            if(err){
                return res.status(500).send({message: 'Error ocurrido durante la busqueda, intente de nuevo'});
            }else if(hotelFind){
                    room.name = params.name;
                    room.price = params.price;
                    room.available = 'Disponible';
                    room.save((err, RoomSaved)=>{
                    if(err){
                        return res.status(500).send({message: 'Error ocurrido al intentar guardar la habitación'});
                    }else if(RoomSaved){
                        Hotel.findByIdAndUpdate(hotelId, {$push:{room: RoomSaved._id}}, {new: true}, (err, pushRoom)=>{
                            if(err){
                                return res.status(500).send({message: 'Error durante el guardado de la habitación'});
                            }else if(pushRoom){
                                return res.send({message: 'Habitación agregada de manera exitosa', pushRoom});
                            }else{
                                return res.status(404).send({message: 'Error ocurrido al intentar guardar la habitación'});
                            }
                        }).populate('room')
                    }else{
                        return res.status(404).send({message: 'Habitación no guardada'});
                    }
                })

            }else{
                return res.status(404).send({message: 'No encontramos ningún hotel coincidente con los datos ingresados'});
            }
        })
}



function updateRoom(req, res){
    let hotelId = req.params.idH;
    let roomId = req.params.idR;
    let update = req.body;
    console.log(roomId, hotelId)
        if(update.name){
            Hotel.findOne({_id: hotelId, room: roomId}, (err, hotelRoom)=>{
                if(err){
                    return res.status(500).send({message: 'Error al intentar actualizar la habitación'});
                }else if(hotelRoom){
                    Room.findByIdAndUpdate(roomId, update, {new: true}, (err, updateRoom)=>{
                        if(err){
                            return res.status(500).send({message: 'Error general durante la actualización de la habitación'});
                        }else if(updateRoom){
                            return res.send({message: 'Habitación actualizada de manera exitosa', updateRoom});
                        }else{
                            return res.status(401).send({message: 'No se pudo actualizar la habitación', hotelRoom});
                        }
                    })
                }else{
                    return res.status(404).send({message: 'No se encontró ningún hotel coincidente'});
                }
            }) 
        }else{
            return res.status(404).send({message: 'Por favor ingresa los datos obligatorios para poder realizar esta acción'});
        }       
}



function deleteRoom(req, res){
    let hotelId = req.params.idH;
    let roomId = req.params.idR;
        Hotel.findOneAndUpdate({_id: hotelId, room: roomId},
            {$pull: {room: roomId}}, {new:true}, (err, roomPull)=>{
                if(err){
                    return res.status(500).send({message: 'Error general al intentar eliminar la habitación'})
                }else if(roomPull){
                    Room.findByIdAndRemove(roomId, (err, contactRemoved)=>{
                        if(err){
                            return res.status(500).send({message: 'Ha ocurrido un error al intentar eliminar la habitación', err})
                        }else if(contactRemoved){
                            return res.send({message: 'Habitación eliminada de manera exitosa', roomPull});
                        }else{
                            return res.status(404).send({message: 'No se encontró ningún evento coincidente, probablemente ya haya sido eliminada'})
                        }
                    })
                }else{
                    return res.status(404).send({message: 'No existe ningún hotel con esa habitación relacionada'})
                }
            }).populate('room')
}

module.exports = {
    getRoom,
    getRooms,
    updateRoom,
    deleteRoom,
    setRoom
}