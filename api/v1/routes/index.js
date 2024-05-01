const express = require("express");
const router = new express.Router();

router.use('/crif', require('./crif'));

module.exports = router;
