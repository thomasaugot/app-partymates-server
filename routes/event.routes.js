const express = require("express");
const bcrypt = require("bcrypt");
const mongoose = require("mongoose");

const Event = require("../models/Event.model");
const isAdmin = require("../middleware/isAdmin");

//  Retrieves all the events
router.get("/events", (req, res, next) => {
  Event.find()
    .populate("events")
    .then((allEvents) => res.json(allEvents))
    .catch((err) => res.json(err));
});

// Creates a new event, admin only
router.post("/events", isAdmin, (req, res, next) => {
  const { name, date, image, location, description, linkToTickets } = req.body;

  Event.create({ name, date, image, location, description, linkToTickets })
    .then((response) => res.json(response))
    .catch((err) => res.json(err));
});

// Retrieves a specific event by id
router.get("/events/:eventId", (req, res, next) => {
  const { eventId } = req.params;

  if (!mongoose.Types.ObjectId.isValid(eventId)) {
    res.status(400).json({ message: "Specified id is not valid" });
    return;
  }
});

// Updates a specific event by id, admin only
router.put("/events/:eventId", isAdmin, (req, res, next) => {
    const { eventId } = req.params;
  
    if (!mongoose.Types.ObjectId.isValid(eventId)) {
      res.status(400).json({ message: "Specified id is not valid" });
      return;
    }
  
    Trip.findByIdAndUpdate(eventId, req.body, { new: true })
      .then((updatedEvent) => res.json(updatedEvent))
      .catch((err) => res.json(err));
  });

//Delete an event, admin only
router.post("/events/:eventId/delete", isAdmin, (req, res, next) => {
  Event.findByIdAndDelete(req.params)
    .then(() => {
      res.redirect("/events");
    })
    .catch((err) => {
      console.log("Error deleting event...", err);
      next();
    });
});

module.exports = router;