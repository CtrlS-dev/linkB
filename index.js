require("dotenv").config();
const express = require("express");
const connectToMongoDB = require("./connect");
const URL = require("./models/url");
const urlRoutes = require("./routes/url");
const shortId = require("shortid");
const app = express();
const cors = require("cors");
const PORT = 3000;

// Configuración de CORS
const corsOptions = {
  origin: "http://127.0.0.1:5500",
  methods: ["GET", "POST"],
  allowedHeaders: ["Content-Type"],
};

app.use(cors(corsOptions));

connectToMongoDB(process.env.MONGODB_URI).then(() =>
  console.log("Connected to MongoDB", process.env.MONGODB_URI),
);

app.use(express.json());

// Rutas
app.use("/url", urlRoutes);

app.get("/:shortId", async (req, res) => {
  const shortIdParams = req.params.shortId;
  const entry = await URL.findOneAndUpdate(
    { shortId: shortIdParams },
    { $push: { visitHistory: [{ timestamp: Date.now() }] } },
  );
  const urlRedirect = entry.redirectUrl;
  if (entry) {
    const urlRedirectHttps = /^http/.test(urlRedirect)
      ? urlRedirect.replace(/^http:/, "https:")
      : `https://${urlRedirect}`;
    res.redirect(`${urlRedirectHttps}`);
  } else {
    res.status(404).json({ error: "shortid not found" });
  }
});

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
