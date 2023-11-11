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

module.exports = { validarJwt };
