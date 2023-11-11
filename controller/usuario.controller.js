const { response } = require("express");
const Usuario = require("../models/usuario.model");
const bcrypt = require('bcryptjs');

const allUser = async(req, res = response) => {
    try {

        //Recuperamos de BD todos los usuarios almacenados en la BD
        const usuarios = await Usuario.find();

        return res.status(200).json({
            ok: true,
            usuarios
        });
        
    } catch (error) {
        return res.status(500).json({
            ok: false,
            msg: "Error del servidor, contacte al administrador"
        });
    }
}

const crearUser = async(req, res = response) => {

    //Extraemos de la request los campos que envia el cliente para poderlos manipular como variables en el codigo 
    const { email, name, password} = req.body;
    console.log(name, email, password);
    
    try {

        //Creamos nuestro nuevo usuario apartir del modelo mongoose creado, cómo parametros de entrada le pasamos lo que viene en el body del request
        const usuario = new Usuario(req.body);
        //cifrar el password
        const salt = bcrypt.genSaltSync();
        usuario.password = bcrypt.hashSync(password, salt);

        //Guardamos en la BD nuestro objeto usuario creado anteriormente a aprtir del modelo
        await usuario.save();

        return res.status(201).json({
            ok:true
        });
        
    } catch (error) {
        return res.status(500).json({
            ok: false,
            msg: "Error del servidor, contacte al administrador"
        });
        
    }
}

const deleteUsuario = async (req, res = response) => {

    const uid = req.params.id;
    
    try {

        const usuarioBD = await Usuario.findById(uid);
        if (!usuarioBD) {
            return res.status(404).json({
                ok: false,
                msg: 'No existe el usuario con el ID proporcionado'
            });
        }

        const usuarioEliminado = await Usuario.findByIdAndDelete(uid);

        res.status(200).json({
            ok: true,
            usuario: usuarioEliminado
        });
        
    } catch (error) {
        return res.status(500).json({
            ok: false,
            msg: 'Pongase en contacto con el administrador'
        });
    }
}

module.exports = {
    crearUser,
    allUser
}