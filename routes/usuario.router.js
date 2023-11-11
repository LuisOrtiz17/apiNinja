const { Router } = require("express");
const { check } = require("express-validator")
const {crearUser, allUser, getUser, updateUsuario, deleteUsuario} = require("../controller/usuario.controller");
const { validarCampos } = require("../middlewares/validar-campos");
const { validarJwt } = require("../middlewares/validar-jwt");

const router = Router();
//Rutas para cada recurso

router.get('/',[validarJwt], allUser);

router.get('/:id',
[
    check('id', 'Debe de ser un ID valido').isMongoId(),
    validarCampos
], getUser);

router.post('/new',[
    //check valida que el campo cumpla con los requerimientos definidos, si no cumple guarda los errores en la req
    check('name', 'EL nombre es un campo obligatorio').not().isEmpty(),
    check('email', 'EL email es un campo obligatorio').isEmail(),
    check('password', 'EL password es un campo obligatorio').isLength({min: 6}),
    validarCampos // Validamos si los check dejaron errores en la req, si existen los valida y muestra en el response
], crearUser);

router.put('/:id',
[
    check('id', 'Debe de ser un ID valido').isMongoId(),
    check('name', 'El nombre es un campo obligatorio').not().isEmpty(),
    check('email', 'El email es un campo obligatorio').isEmail(),
    validarCampos
],
updateUsuario);

router.delete('/:id',deleteUsuario);


module.exports = router;