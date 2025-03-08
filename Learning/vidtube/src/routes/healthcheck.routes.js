const express = require("express");
const router = express.Router();

const healthcheckContoller = require("../controllers/healthcheck.controllers");

// /api/v1/healthcheck/

router.route('/').get(healthcheckContoller.healthcheck);


module.exports = router;
