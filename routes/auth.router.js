const { Router} = require("express");

const router = Router();

router.get('/', (req, res) => {

    res.status(201).json({
        ok: true,
        msg: 'Mi segunda API NodeJS'
    })
});

module.exports = router;