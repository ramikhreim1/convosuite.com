const express = require('express');
const { getApiUsageData, getAdminUsersActivity, mostUseCase, timeSavedEstimate,productivityEstimate } = require('../controller/apiUsage');
const { isLoggedIn } = require("../auth/authJwt");


const router = express.Router();

router.use('/', isLoggedIn)
router.post("/", getApiUsageData);
router.post("/user-activity", getAdminUsersActivity);
router.post("/most-used-use-case", mostUseCase);
router.post("/time-saved-estimation", timeSavedEstimate);
router.post("/productivity-estimation", productivityEstimate);

module.exports = router;