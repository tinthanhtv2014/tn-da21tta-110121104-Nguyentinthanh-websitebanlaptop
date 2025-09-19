// src/router/novu-router.js
const express = require("express");
const router = express.Router();

router.post("/", (req, res) => {
  console.log("📩 Novu Bridge payload:", req.body);
  res.status(200).send("Novu Bridge connected");
});

module.exports = router;
