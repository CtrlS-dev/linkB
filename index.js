const mongoose = require("mongoose");
require("dotenv").config();
const express = require("express");
// const connectToMongoDB = require("./connect");
const URL = require("./models/url");
const urlRoutes = require("./routes/url");
const shortId = require("shortid");
const app = express();
const cors = require("cors");
const PORT = process.env.PORT;

// Configuración de CORS
const corsOptions = {
  origin: "https://lbreaker.vercel.app/",
  methods: ["GET", "POST"],
  allowedHeaders: ["Content-Type"],
};

app.use(cors(corsOptions));

const connectToMongoDB = async () => {
  try {
    const uri = process.env.MONGODB_URI;
    if (!uri) {
      throw new Error("MONGODB_URI is not defined in environment variables");
    }
    await mongoose.connect(uri);
    console.log("Connected to MongoDB");
  } catch (error) {
    console.error("Error connecting to MongoDB:", error.message);
  }
};

connectToMongoDB();

app.use(express.json());

// Rutas
app.use("/url", urlRoutes);

app.get("/", (req, res) => {
  res.send("Welcome to the URL shortener API");
  console.log("Welcome to the URL shortener API");
});

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
