'use strict'

var Event = require('../models/event.model'); 
var Hotel = require('./../models/hotel.model');

function getEvents(req, res){
    Event.find({}).populate('event').exec((err, foundEvents) => {
        if(err){
            return res.status(500).send({message: "Hubo un error al realizar la busqueda de eventos"})
        }else if(foundEvents){ 
            return res.send({message: "Eventos encontrados exitosamente", foundEvents})
        }else{
            return res.status(404).send({message: "No encontramos ningún evento con esas caracteristicas"})
        }
    })
}

function getEvent(req, res){
    var eventId = req.params.id;

    if(req.user.role === "ROLE_ADMIN"){
        Event.findById(eventId).exec((err, foundEvent) => {
            if(err){
                return res.status(500).send({message: "Hubo un error al realizar la busqueda de eventos"})
            }else if(foundEvent){
                return res.send({message: "Evento encontrado exitosamente", foundEvents})
            }else{
                return res.status(404).send({message: "No encontramos ningún evento con esas caracteristicas"})
            }
        })
    }else{  
        return res.status(404).send({message: "No posees permisos necesarios para realizar esta acción"})
    }

}

function setEvent(req, res){
    var hotelId = req.params.id;
    var params = req.body;
    var event = new Event();
        Hotel.findById(hotelId, (err, hotelFind)=>{
            if(err){
                return res.status(500).send({message: 'Hubo un error durante la busqueda de eventos'});
            }else if(hotelFind){
                    event.name = params.name;
                    event.description = params.description;
                    event.typeEvent = params.typeEvent;
                    event.dateEvent = params.dateEvent;
                    event.save((err, eventSaved)=>{
                    if(err){
                        return res.status(500).send({message: 'Error al intentar guardar el evento'});
                    }else if(eventSaved){
                        Hotel.findByIdAndUpdate(hotelId, {$push:{event: eventSaved._id}}, {new: true}, (err, pushEvent)=>{
                            if(err){
                                return res.status(500).send({message: 'Error al recibir datos de la habitación relacionada'});
                            }else if(pushEvent){
                                return res.send({message: 'Evento registrado exitosamente', pushEvent});
                            }else{
                                return res.status(404).send({message: 'Error al registrar el evento, verifique los datos he intente de nuevo'});
                            }
                        }).populate('event')
                    }else{
                        return res.status(404).send({message: 'Evento no creado'});
                    }
                })

            }else{
                return res.status(404).send({message: 'Error general durante el guardado del evento'});
            }
        })
}

function updateEvent(req, res){
    let hotelId = req.params.idH;
    let eventId = req.params.idE;
    let update = req.body;
    console.log(eventId, hotelId)
        if(update.name){
            Hotel.findOne({_id: hotelId, event: eventId}, (err, hotelEvent)=>{
                if(err){
                    return res.status(500).send({message: 'Error al intentar actualizar el evento'});
                }else if(hotelEvent){
                    Event.findByIdAndUpdate(eventId, update, {new: true}, (err, updateEvent)=>{
                        if(err){
                            return res.status(500).send({message: 'Error general durante la actualización del evento'});
                        }else if(updateEvent){
                            return res.send({message: 'Evento actualizado de manera exitosa', updateEvent});
                        }else{
                            return res.status(401).send({message: 'No se pudo actualizar el evento'});
                        }
                    })
                }else{
                    return res.status(404).send({message: 'No se encontró ningún evento coincidente'});
                }
            }) 
        }else{
            return res.status(404).send({message: 'Por favor ingresa los datos obligatorios para poder realizar esta acción'});
        }       
}

function deleteEvent(req, res){
    let hotelId = req.params.idH;
    let eventId = req.params.idE;
        Hotel.findOneAndUpdate({_id: hotelId, event: eventId},
            {$pull: {event: eventId}}, {new:true}, (err, eventPull)=>{
                if(err){
                    return res.status(500).send({message: 'Error general al intentar eliminar el evento'})
                }else if(eventPull){
                    Event.findByIdAndRemove(eventId, (err, eventRemoved)=>{
                        if(err){
                            return res.status(500).send({message: 'Ha ocurrido un error al intentar eliminar el evento', err})
                        }else if(eventRemoved){
                            return res.send({message: 'Evento eliminado de manera exitosa', eventPull});
                        }else{
                            return res.status(404).send({message: 'No se encontró ningún evento coincidente, probablemente ya haya sido eliminado'})
                        }
                    })
                }else{
                    return res.status(404).send({message: 'No existe ningún hotel con ese evento relacionado'})
                }
            }).populate('event')
}


module.exports = {
    setEvent,
    updateEvent,
    getEvents,
    getEvent,
    deleteEvent
}