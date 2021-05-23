'use strict'

var User = require('../models/user.model');
var bcrypt = require('bcrypt-nodejs');
var jwt = require('../services/jwt');

function initAdmin(req, res){
    let user = new User();
    user.username = 'AdminApp'
    user.password = '1234'

    User.findOne({username: user.username}, (err, adminFind)=>{
        if(err){
            return res.status(500).send({message: 'general error'});
        }else if(adminFind){
            return console.log('Usuario admin ya fue creado')
        }else{
            bcrypt.hash(user.password, null, null, (err, passwordHash)=>{
                if(err){
                    return res.status(500).send({message: 'Error general al comparar contraseña'})
                }else if(passwordHash){
                    user.password = passwordHash;
                    user.username = user.username;
                    user.role = 'ROLE_ADMIN';
                    user.save((err, userSaved)=>{
                        if(err){
                            return res.status(500).send({message: 'Error al guardar Administrador'})
                        }else if(userSaved){
                            return console.log('Administrador creado satisfactoriamente')
                        }else{
                            return res.status(500).send({message: 'Administrador no guardado'})
                        }
                    })
                }else{
                    return res.status(403).send({message: 'Contraseña no logro encriptarse'})
                }
            })
        }
    })
}


//Login
function login(req, res){
    var params = req.body;

    if(params.username && params.password){
        User.findOne({username: params.username}, (err, userFind) => {
            if(err){
                return res.status(500).send({message: "Error al buscar el usuario"})
            }else if(userFind){
                bcrypt.compare(params.password, userFind.password, (err, checkPassword) => {
                    if(err){
                        return res.status(500).send({message: "Error al comparar la contraseña"})
                    }else if(checkPassword){
                        if(params.gettoken){
                            res.send({
                                token: jwt.createToken(userFind),
				                user: userFind
                            })
                        }else{
                            return res.send({ message: "Usuario logeado", userFind})
                        }
                    }else{
                        return res.status(401).send({message: "Contraseña incorrecta"})
                    }
                })
            }else{
                return res.send({message: "Usuario sin existencia"})
            }
        })
    }else{
        return res.status(404).send({message: "Ingrese Username y contraseña"})
    }
}

//Crud

function createUserAdminHotel(req, res){
    var user = new User();
    var params = req.body;

    if(params.name && params.username && params.password && params.email && params.role){
        User.findOne({username: params.username},(err, userFind)=>{
            if(err){
                return res.status(500).send({message: "Error al buscar un usuario"});
            }else if(userFind){
                return res.send({message: "Username en uso"});
            }else{
                bcrypt.hash(params.password,null,null,(err, passwordHash)=>{
                    if(err){
                        return res.status(500).send({message: "Ocurrio un error al encriptar la password"});
                    }else if(passwordHash){
                        user.password = passwordHash;
                        user.name = params.name;
                        user.lastname = params.lastname;
                        user.username = params.username;
                        user.email = params.email;
                        user.role = 'ROLE_ADMIN_HOTEL';
                        user.save((err,userSaved)=>{
                            if(err){
                                return res.status(500).send({message: "Error al guardar usuario"});
                            }else if(userSaved){
                                return res.send({message: "Usuario creado satisfactoriamente", userSaved});
                            }else{
                                return res.status(500).send({message: "Usuario no guardado"});
                            }
                        })
                    }else{
                        return res.status(401).send({message: "la contraseña no encriptada"});
                    }
                })
            }
        })
    }else{
        return res.status(401).send({message: "Por favor ingrese los campos minimos: name, username, password, email, role"})
    }

}

function register(req, res){
    var user = new User();
    var params = req.body;

    if(params.name && params.username && params.password && params.email){
        User.findOne({username: params.username}, (err, userFind) => {
            if(err){
                return res.status(404).send({message: 'Ocurrio un error al buscar el usuario'})
            }else if(userFind){
                return res.send({message: "Nombre no disponible"})
            }else{
                bcrypt.hash(params.password, null, null, (err, passwordHash) => {
                    if(err){
                        return res.status(404).send({message: "Error de encriptación", err})
                    }else if(passwordHash){
                        user.password = passwordHash;
                        user.name = params.name;
                        user.lastname = params.lastname;
                        user.username = params.username;
                        user.email = params.email;
                        user.role = 'ROL_USER';
                        user.save((err, userSaved) => {
                            if(err){
                                return res.status(404).send({message: "ocurrio un error al querer guardar el usuario"})
                            }else if(userSaved){
                                return res.send({message: "Usuario creado satisfactoriamente",userSaved})
                            }else{
                                return res.status(403).send({message: "Error al Guardar Datos"})
                            }
                        })
                    }else{
                        return res.status(401).send({message: "la contraseña no encriptada"})
                    }
                })
            }
        })
    }else{
        return res.status(404).send({message: "Ingrese los datos minimos: Username, name, password, email."})
    }
}

function updateUser(req, res){
    let userId = req.params.id;
    let update = req.body;

    if(userId != req.user.sub){
        return res.status(401).send({ message: 'No tienes permiso para realizar esta acción'});
    }else{
        if(update.password || update.role){
            return res.status(401).send({ message: 'No se puede actualizar la contraseña ni el rol desde esta función'});
        }else{
            if(update.username){
                User.findOne({username: update.username.toLowerCase()}, (err, userFind)=>{
                    if(err){
                        return res.status(500).send({ message: 'Error general'});
                    }else if(userFind){
                        if(userFind._id == req.user.sub){
                            User.findByIdAndUpdate(userId, update, {new: true}, (err, userUpdated)=>{
                                if(err){
                                    return res.status(500).send({message: 'Error general al actualizar'});
                                }else if(userUpdated){
                                    return res.send({message: 'Usuario actualizado', userUpdated});
                                }else{
                                    return res.send({message: 'No se pudo actualizar al usuario'});
                                }
                            })
                        }else{
                            return res.send({message: 'Nombre de usuario ya en uso'});
                        }
                    }else{
                        User.findByIdAndUpdate(userId, update, {new: true}, (err, userUpdated)=>{
                            if(err){
                                return res.status(500).send({message: 'Error general al actualizar'});
                            }else if(userUpdated){
                                return res.send({message: 'Usuario actualizado', userUpdated});
                            }else{
                                return res.send({message: 'No se pudo actualizar al usuario'});
                            }
                        })
                    }
                })
            }else{
                User.findByIdAndUpdate(userId, update, {new: true}, (err, userUpdated)=>{
                    if(err){
                        return res.status(500).send({message: 'Error general al actualizar'});
                    }else if(userUpdated){
                        return res.send({message: 'Usuario actualizado', userUpdated});
                    }else{
                        return res.send({message: 'No se pudo actualizar al usuario'});
                    }
                })
            }
        }
    }
    
}

function removeUser(req, res){
    let userId = req.params.id;
    let params = req.body;

    if(userId != req.user.sub){
        return res.status(403).send({message: ' No tienes permiso para realizar esta acción'})
    }else{
        if(!params.password){
            return res.status(401).send({message: 'Por favor ingresa la contraseña para poder eliminar tu cuenta'});
        }else{
            User.findById(userId, (err, userFind)=>{
                if(err){
                    return res.status(500).send({message: 'Error general'})
                }else if(userFind){
                    bcrypt.compare(params.password, userFind.password, (err, checkPassword)=>{
                        if(err){
                            return res.status(500).send({message: 'Error general al verificar contraseña'})
                        }else if(checkPassword){
                            User.findByIdAndRemove(userId, (err, userFind)=>{
                                if(err){
                                    return res.status(500).send({message: 'Error general al verificar contraseña'})
                                }else if(userFind){
                                    return res.send({message: 'Usuario eliminado', userRemoved:userFind})
                                }else{
                                    return res.status(404).send({message: 'Usuario no encontrado o ya eliminado'})
                                }
                            })
                        }else{
                            return res.status(403).send({message: 'Contraseña incorrecta, solo con tu contraseña podrás eliminar tu cuenta'})
                        }
                    })
                }else{
                    return res.status(404).send({message: 'Usuario inexistente o ya eliminado'})
                }
            })
        }
    }
}

function getUsers(req, res){
    User.find({}).exec((err, userFinds) => {
        if(err){
            return res.status(500).send({message: "Error al buscar los usuarios"})
        }else if(userFinds){
            return res.send({message: "Usuarios encontrados", userFinds})
        }else{
            return res.status(204).send({message: "No se encontraron usuarios"})
        }
    })
}

function getUser(req, res){
    User.findById(req.params.id).exec((err, userFind) => {
        if(err){
            return res.status(500).send({message: "Error al obtener el usuario"})
        }else if(userFind){
            return res.send({message: "Usuario encontrado", userFind})
        }else{ 
            return res.status(404).send({message: "No existe ningun usuario"})
        }
    })
}


module.exports = {
    initAdmin,
    register,
    getUser,
    getUsers,
    login,
    removeUser,
    updateUser,
    createUserAdminHotel
}