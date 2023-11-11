const { response } = require("express");
const Tarea = require('../models/tarea.model');

const crearTarea = async(req, res = response) => {

    const userId = req.uid;
    const tarea = new Tarea({
        usuario: userId,
        ...req.body
    });

    try {
        const tareaBD = await tarea.save();

        res.status(200).json({
            ok: true,
            tarea: tareaBD
        });
        
    } catch (error) {
        return res.status(500).json({
            ok: false,
            msg: "Error del servidor, contacte al administrador"
        });
    }
}

const getTareas = async(req, res = response) => {

    try {
        const tareas = await Tarea.find()
        .populate('usuario', 'name email');
        res.status(200).json({
            ok: true,
            tareas
        });
        
    } catch (error) {
        return res.status(500).json({
            ok: false,
            msg: "Error del servidor, contacte al administrador"
        });
    }
}

const findTareaUser = async(req, res = response) => {

    const userId = req.params.id;
    try {

        const tareas = await Tarea.find({usuario: userId});
        res.status(200).json({
            ok: true,
            tareas
        });
        
    } catch (error) {
        return res.status(500).json({
            ok: false,
            msg: "Error del servidor, contacte al administrador"
        });
    }
}

module.exports = {
    crearTarea,
    findTareaUser,
    getTareas
}

