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
      msg: "Error del servidor, contacte al administrador"
    });
  }
};

const cambioPassword = async(req, res = response) =>{
    const uid = req.uid;
    const id = req.params.id;
    try {

        if( uid !== id){
            return res.status(401).json({
                ok: false,
                msg: 'El password sólo puede ser modificado por su propietario'
            });
        }

        const { newPassword, oldPassword } = req.body;
        const user = await Usuario.findById(uid);

        const validPassCurrent = bcrypt.compareSync( oldPassword, user.password);

        if(!validPassCurrent){
            return res.status(400).json({
                ok: false,
                msg: 'El password anterior no coincide con el registrado'
            });
        }

        //Hashear nuevo password
        const salt = bcrypt.genSaltSync();
        const passwordCifrada = bcrypt.hashSync(newPassword, salt);

        const userUpdate = await Usuario.findByIdAndUpdate(id, {password: passwordCifrada}, {new: true});

        return res.status(200).json({
            ok: true,
            usuario: userUpdate
        });

        
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            ok: false,
            msg: "Error del servidor, contacte al administrador"
        });
    }
}

module.exports = {
  loginUser,
  cambioPassword
};
