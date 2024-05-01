const express = require("express");
const { getReport, response } = require("../../controllers/crif");

const router = express.Router();

router.post("/get-report", getReport);


module.exports = router;