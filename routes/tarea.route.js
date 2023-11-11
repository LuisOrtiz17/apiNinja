const { Router } = require("express");
const { check } = require("express-validator");
const { validarCampos } = require("../middlewares/validar-campos");
const { validarJWT, validateRole_mismoUsuario, validateRole } = require("../middlewares/validar-jwt");
const { getTareas, findTareaUser, crearTarea } = require("../controller/tarea.controller");

const router = Router();

router.get('/', getTareas);

router.get('/user/:id',
[
    check('id', 'Debe de ser un ID valido').isMongoId(),
    validarCampos
], findTareaUser);

router.post('/new',
[
    check('title', 'El titulo de la tarea es obligatorio').not().isEmpty(),
    check('description', 'El detalle de la tarea es obligatorio').not().isEmpty(),
    validarCampos
], crearTarea);


module.exports = router;