const ShortUniqueId = require('short-unique-id');
const URL = require('../models/url.model.js');



async function handleGenerateNewShortURL(req, res) {
    const body = req.body;
    if (!body.url) return res.status(400).json({ error: "url is required"})
    const uid = new ShortUniqueId({ length: 8 });
    const shortUniqueID = uid.rnd();
    await URL.create({
        shortId: shortUniqueID,
        redirectURL: body.url,
        visitHistory: [],
    });
    
    return res.json({ id: shortUniqueID });
}

async function handleGetAnalytics(req, res) {
    const shortId = req.params.shortId;
    const result = await URL.findOne({ shortId });
    return res.json({
        totalClicks: result.visitHistory.length,
        analytics: result.visitHistory,
    });
}

module.exports = {
    handleGenerateNewShortURL,
    handleGetAnalytics,
}
