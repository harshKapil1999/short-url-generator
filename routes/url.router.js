const express = require('express');
const { 
    handleGenerateNewShortURL,
    handleGetAnalytics
 } = require("../controllers/url.controller.js");
const router = express.Router();

router.post('/', handleGenerateNewShortURL); 

router.get("/analytics/:shortId", handleGetAnalytics);

module.exports = router;