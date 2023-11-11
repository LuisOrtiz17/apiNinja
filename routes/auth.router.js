const { Router} = require("express");
const { loginUser, cambioPassword } = require("../controller/login.controller");
const { validarCampos } = require("../middlewares/validar-campos");
const { check } = require("express-validator")

const router = Router();

router.post('/',[
    check('email', 'El email es obligatorio').isEmail(),
    check('password', 'La contraseña es obligatoria').isLength({min:6}),
    validarCampos
], loginUser);

//Cambio de password
router.put('/changePassword/:id',
[
    check('oldPassword', 'La contraseña anterior es obligatoria').isLength({min:6}),
    check('newPassword', 'La nueva contraseña es obligatoria').isLength({min:6}),
    validarCampos
], cambioPassword);

module.exports = router;