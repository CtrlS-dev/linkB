const shortId = require("shortid");
const URL = require("../models/url");

const generateNewShortURL = async (req, res) => {
  const url = req.body;
  if (!url.url) return res.status(400).json({ error: "url is required" });

  const shortIdValue = shortId.generate();
  await URL.create({
    shortId: shortIdValue,
    redirectUrl: url.url,
    visitHistory: [],
  });

  return res.json({ id: shortIdValue });
};

const getAnalytics = async (req, res) => {
  const shortId = req.params.shortid;
  const result = await URL.findOne({ shortId });
  return res.json({
    totalClicks: result.visitHistory.length,
    analytics: result.visitHistory,
  });
};

module.exports = { generateNewShortURL, getAnalytics };
