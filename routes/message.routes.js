const express = require("express");
const bcrypt = require("bcrypt");
const mongoose = require("mongoose");
const router = express.Router();

const { isAuthenticated } = require("../middleware/jwt.middleware");
const User = require("../models/User.model");
const Message = require("../models/Message.model");

// GET all the messages from a user
router.get("/messages", isAuthenticated, (req, res, next) => {
    const userId = req.payload._id;
    User.findById(userId)
      .populate("messages")
      .then((allMessages) => {
        console.log(allMessages);
        res.json(allMessages);
      })
      .catch((err) => res.json(err));
  });

//POST user sends a message
router.post("/messages", isAuthenticated, (req, res, next) => {
    const { recipient, content } = req.body;
    const creator = req.payload._id;
  
    Message.create({ content, recipient: recipient })
      .then((messageFromDB) => {
        return User.findByIdAndUpdate(recipient, {
          $push: { messages: messageFromDB._id },
        });
      })
      .then((response) => res.status(201).json(response))
      .catch((err) => {
        console.log("error adding trip...", err);
        res.status(500).json(err);
      });
  });

  module.exports = router;