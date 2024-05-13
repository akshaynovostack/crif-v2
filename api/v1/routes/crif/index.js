const express = require("express");
const { getReport, withDrawConsent } = require("../../controllers/crif");

const router = express.Router();

router.post("/get-report", getReport);
router.delete("/withdraw-consent/:customer_id", withDrawConsent);


module.exports = router;