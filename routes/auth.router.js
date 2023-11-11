const { Router} = require("express");
const { loginUser } = require("../controller/login.controller");

const router = Router();

router.post('/', loginUser);

module.exports = router;