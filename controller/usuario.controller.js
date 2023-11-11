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

const getUser = async(req, res = response) => {
    const uid = req.params.id;
    try {

        const usuarioBD = await Usuario.findById(uid);

        if (!usuarioBD) {
            return res.status(404).json({
                ok: false,
                msg: 'No existe el usuario con el ID solicitado'
            });
        }

        res.status(200).json({
            ok: true,
            usuarioBD
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

const updateUsuario =  async (req, res = response) => {

    const uid = req.params.id;
    try {
        const usuarioBD = await Usuario.findById(uid);

        if (!usuarioBD) {
            return res.status(404).json({
                ok: false,
                msg: 'No existe el usuario con el ID solicitado'
            });
        }

        const { password, role, ...campos } = req.body;

        if (usuarioBD.email !== campos.email) {
            const existeEmail = await Usuario.findOne({ email: campos.email });

            if (existeEmail) {
                return res.status(400).json({
                    ok: false,
                    msg: 'Ya existe un usuario con ese email'
                });
            }

        }

        //Si el usuario es ADMIN puede actualizar el rol de su usuario y/o otros usuarios
        //req.role => role del usuario que esta logeado y manda la peticion
        if( role && req.role === 'ADMIN_ROLE'){
            campos.role = role;
        }

        const userActualizado = await Usuario.findByIdAndUpdate(uid, campos, {new: true});

        return res.status(200).json({
            ok: true,
            usuario: userActualizado
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
                msg: 'No existe el usuario con el ID solicitado'
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
            msg: "Error del servidor, contacte al administrador"
        });
    }
}

module.exports = {
    crearUser,
    allUser,
    getUser,
    deleteUsuario,
    updateUsuario
}