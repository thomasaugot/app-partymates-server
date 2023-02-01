const express = require("express");
const router = express.Router();
const Trip = require('../models/Trip.model')

router.get("/", (req, res, next) => {
  res.json("All good in here");
});

//adding my project to keep me alive so it doesn't pause after 60days of inactivity on mongoDB atlas
router.get('/keep-alive', (req, res, next) => {
  Trip.find()
    .then(() => {
      res.status(200).json({ message: 'It worked' });
    })
    .catch(() => {
      res.status(500).json({ message: "It didn't work" });
    });
});

module.exports = router;
