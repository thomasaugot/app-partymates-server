const express = require("express");
const bcrypt = require("bcrypt");
const mongoose = require("mongoose");

const User = require("../models/User.model");
const Event = require("../models/Event.model");
const isAdmin = require("../middleware/isAdmin");

//  Retrieves all the events
router.get("/:cityId/events", (req, res, next) => {
  Event.find()
    .populate("events")
    .then((allEvents) => res.json(allEvents))
    .catch((err) => res.json(err));
});

// Creates a new event, admin only
router.post("/:cityId/events", isAdmin, (req, res, next) => {
  const { name, date, image, location, description, linkToTickets } = req.body;

  Event.create({ name, date, image, location, description, linkToTickets })
    .then((response) => res.json(response))
    .catch((err) => res.json(err));
});

// Retrieves a specific event by id
router.get("/:cityId/events/:eventId", (req, res, next) => {
  const { eventId } = req.params.eventId;

  if (!mongoose.Types.ObjectId.isValid(eventId)) {
    res.status(400).json({ message: "Specified id is not valid" });
    return;
  }
});

//Delete an event
router.post("/:cityId/events/:eventId/delete", isAdmin, (req, res, next) => {
  Event.findByIdAndDelete(req.params.eventId)
    .then(() => {
      res.redirect("/:cityId/events");
    })
    .catch((err) => {
      console.log("Error deleting event...", err);
      next();
    });
});
