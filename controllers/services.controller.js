'use strict'

var Services = require('../models/services.model')



function createService(req, res){
    var service = new Services();
    var params = req.body;

    if(params.name){
        Services.findOne({name: params.name}, (err, serviceFound) => {
            if(err){
                return res.status(500).send({message: "Hubo un error al realizar la busqueda del servicio"})
            }else if(serviceFound){
                return res.send({message: "El servicio ya fue registrado", serviceFound})
            }else{
                    service.name = params.name;
                    service.description = params.description;
                    service.price = params.price;
                    service.save((err, serviceSaved) => {
                        if(err){
                            return res.status(500).send({message: "Error al intentar registrar el servicio"})
                        }else if(serviceSaved){
                            return res.send({message: "Servicio guardado de manera exitosa", serviceSaved})
                        }else{
                            return res.status(401).send({message: "No se pudieron registrar los datos del servicio"})
                        }
                    })
            }
        })
    }else{
        return res.status(401).send({message: "Por favor ingresa los datos obligatorios para poder realizar esta acción"})
    }
}

function updateService(req, res){
    var serviceId = req.params.id;
    var update = req.body;

    if(serviceId){
        Services.findById(serviceId, (err, serviceFound) => {
            if(err){
                return res.status(500).send({message: "Hubo un error al realizar la busqueda del servicio"})
            }else if(serviceFound){
                    Services.findByIdAndUpdate(serviceId, update, {new: true}, (err, serviceUpdated) => {
                        if(err){
                            return res.status(500).send({message: "Error al intentar actualizar el servicio"})
                        }else if(serviceUpdated){
                            return res.send({message: "Servicio actualizado exitosamente", serviceUpdated})
                        }else{ 
                            return res.status(401).send({message: "No se pudo actualizar el servicio"})
                        }
                    })
            }else{
                return res.status(401).send({message: "Por favor ingrese el parametro correcto en la URI"})
            }
        })
    }
}




function deleteService(req, res){
    var serviceId = req.params.id;

    if(serviceId){
        Services.findById(serviceId, (err, serviceFound) => {
            if(err){
                return res.status(500).send({message: "Hubo un error al realizar la busqueda del servicio"})
            }else if(serviceFound){
                    Services.findByIdAndRemove(serviceId, (err, serviceRemoved) => {
                        if(err){
                            return res.status(500).send({message: "Error al intentar eliminar el servicio"})
                        }else if(serviceRemoved){
                            return res.send({message: "Servicio eliminado de manera exitosa", serviceRemoved})
                        }else{
                            return res.status(401).send({message: "El servicio no fue eliminado"})
                        }
                    })
            }else{
                return res.status(204).send({message: "El servicio solicitado es inexistente"})
            }
        })
    }else{
        return res.status(400).send({message: "Por favor escriba el parametro correcto en la URI"})
    }
}


function getServices(req, res){
    Services.find({}).exec((err, servicesFound) => {
        if(err){
            return res.status(500).send({message: "Hubo un error al realizar la busqueda de servicios"})
        }else if(servicesFound){
            return res.send({message: "Servicios encontrados exitosamente", servicesFound})
        }else{
            return res.status(204).send({message: "No se encontraron servicios coincidentes"})
        }
    })
}


function getService(req, res){
    var serviceId = req.params.id;
    if(req.user.role === "ROLE_ADMIN"){
        Services.findById(serviceId, (err, serviceFound) => {
            if(err){    
                return res.status(500).send({message: "Ocurrio un error açdurante la busqueda del servicio"})
            }else if(serviceFound){
                return res.send({message: "Servicio encontrado", serviceFound})
            }else{
                return res.status(204).send({message: "El servicio buscado es inexistente"})
            }
        })
    }else{
        return res.status(404).send({message: "No posees permisos necesarios para realizar esta acción"})
    }
}

module.exports = {
    getService,
    getServices,
    createService,
    updateService,
    deleteService
}