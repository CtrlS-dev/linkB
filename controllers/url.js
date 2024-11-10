const shortId = require("shortid");
const URL = require("../models/url");

const generateNewShortURL = async (req, res) => {
  const url = req.body;
  if (!url.url) return res.status(400).json({ error: "url is required" });

  try {
    const shortIdValue = shortId.generate();
    await URL.create({
      shortId: shortIdValue,
      redirectUrl: url.url,
      visitHistory: [],
    });

    return res.json({ id: shortIdValue });
  } catch (error) {
    console.error("Error generating short URL:", error.message);
    return res.status(500).json({ error: "Internal Server Error" });
  }
};

const getAnalytics = async (req, res) => {
  const shortId = req.params.shortid;
  try {
    const result = await URL.findOne({ shortId });
    if (!result) return res.status(404).json({ error: "shortid not found" });
    return res.json({
      totalClicks: result.visitHistory.length,
      analytics: result.visitHistory,
    });
  } catch (error) {
    console.error("Error getting analytics:", error.message);
    return res.status(500).json({ error: "Error getting analytics" });
  }
};

module.exports = { generateNewShortURL, getAnalytics };
