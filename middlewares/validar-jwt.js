const { response } = require("express");
const jwt = require("jsonwebtoken");

const validarJwt = (req, res = response, next) => {
  const token = req.header("x-token");
  if (!token) {
    return res.status(400).json({
      ok: false,
      msg: "no hay token en la REQ",
    });
  }

  try {
    const { uid, role } = jwt.verify(token, process.env.SECRET_KEY);
    req.uid = uid;
    req.role = role;

    next();
  } catch (error) {
    return res.status(401).json({
      ok: false,
      msg: "Token no valido",
    });
  }
};

const validateRole = async (req, res, next) => {
  const uid = req.uid;

  try {
    const usuarioDB = await Usuario.findById(uid);

    //Puede que este codigo sea redundante porque si esta logueado es porque existe
    if (!usuarioDB) {
      return res.status(404).json({
        ok: false,
        msg: "El usuario con el que esta logueado no existe",
      });
    }

    if (usuarioDB.role !== "ADMIN_ROLE") {
      return res.status(403).json({
        ok: false,
        msg: "No cuenta con los privilegios para realizar la consulta",
      });
    }

    next();
  } catch (error) {
    return res.status(500).json({
      ok: false,
      msg: "Error inesperado... contacte con el administrador",
    });
  }
};

const validateRole_mismoUsuario = async (req, res = response, next) => {
  const uid = req.uid;
  const id = req.params.id;
  try {
    const usuarioBD = await Usuario.findById(uid);
    //Puede que sea redundante porque se esta validando que exista un usuario que ya esta logueado y validado su JWT
    if (!usuarioBD) {
      return res.status(404).json({
        ok: false,
        msg: "Usuario no existe",
      });
    }

    if (usuarioBD.role === "ADMIN_ROLE" || uid === id) {
      req.role = usuarioBD.role;
      next();
    } else {
      return res.status(403).json({
        ok: false,
        msg: "No tiene privilegios para realizar esta petición",
      });
    }
  } catch (error) {
    return res.status(500).json({
      ok: false,
      msg: "Error inesperado... contacte con el administrador",
    });
  }
};

module.exports = {
  validarJwt,
  validateRole,
  validateRole_mismoUsuario,
};
