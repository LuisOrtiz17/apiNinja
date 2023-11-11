const { response } = require("express");
const Usuario = require("../models/usuario.model");

const bcrypt = require("bcryptjs");
const { generarJWT } = require("../helpers/jwt");

const loginUser = async (req, res = response) => {
  const { email, password } = req.body;
  try {
    //Buscamos por email en la BD el usuario que intenta hacer login
    const dbUser = await Usuario.findOne({ email });

    //Validamos que exista en la BD el usuario que intenta hacer login
    if (!dbUser) {
      return res.status(404).json({
        ok: false,
        msg: "El usuario no existe",
      });
    }

    //validar password: Comparamos el password de la request con el password cifrado del usuario
    const validPass = bcrypt.compareSync(password, dbUser.password);
    if (!validPass) {
      return res.status(400).json({
        ok: false,
        msg: "Password incorrecto",
      });
    }

    //Generar JWT la función generarJWT la creamos en el archivo jwt.js
    const token = await generarJWT(dbUser.uid, dbUser.role);

    return res.status(200).json({
      ok: true,
      email,
      token,
    });
  } catch (error) {
    return res.status(500).json({
      ok: false,
      msg: "Error del servidor, contacte al administrador",
    });
  }
};

module.exports = {
  loginUser,
};
