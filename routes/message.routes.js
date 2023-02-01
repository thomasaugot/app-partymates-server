const express = require("express");
const bcrypt = require("bcrypt");
const mongoose = require("mongoose");
const router = express.Router();

const { isAuthenticated } = require("../middleware/jwt.middleware");
const User = require("../models/User.model");

//GET all the messages from a user
router.get(":userId/messages", isAuthenticated, (req, res, next) => {
    User.findById()
      .populate("messages")
      .then((allMessages) => {
        console.log(allMessages);
        res.json(allMessages);
      })
      .catch((err) => res.json(err));
  });

//POST user sends a message
router.post(":userId/messages", isAuthenticated, (req, res, next) => {
    const { recipient, content } = req.body;
    const creator = req.payload._id;
  
    let newMessage;
  
    Message.create({ content, recipient: userId, creator })
      .then((messageFromDB) => {
        newMessage = messageFromDB;
        return User.findByIdAndUpdate(recipient, {
          $push: { messages: messageFromDB._id },
        });
      })
      .then((response) => res.json(response))
      .catch((err) => {
        console.log("error adding trip...", err);
        res.status(500).json(err);
      });
  });

  module.exports = router;