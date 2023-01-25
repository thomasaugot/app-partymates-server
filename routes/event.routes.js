const express = require("express");
const bcrypt = require("bcrypt");
const mongoose = require("mongoose");
const router = express.Router();

const Event = require("../models/Event.model");
const Trip = require("../models/Trip.model");
const isAdmin = require("../middleware/isAdmin");

//  Render all the events
router.get("/events", (req, res, next) => {
  Event.find()
    .populate("name")
    .then((allEvents) => res.json(allEvents))
    .catch((err) => res.json(err));
});

// Creates a new event, admin only
router.post("/events", (req, res, next) => {
  const { name, date, image, location, description, linkToTickets } = req.body;

  Event.create({
    name,
    date,
    image,
    location,
    description,
    linkToTickets,
    attendees: [],
    tripsOrganized: []
  })
    .then((response) => res.json(response))
    .catch((err) => res.json(err));
});

// Retrieves a specific event by id
router.get("/events/:eventId", (req, res, next) => {

  const eventId = req.params.eventId;

  if (!mongoose.Types.ObjectId.isValid(eventId)) {
    res.status(400).json({ message: "Specified id is not valid" });
    return;
  }

  Event.findById(eventId)
    .then((response) => res.json(response))
    .catch((err) => res.json(err));
});

// Updates a specific event by id, admin only
router.put("/events/:eventId", (req, res, next) => {

  const eventId = req.params.eventId;

  if (!mongoose.Types.ObjectId.isValid(eventId)) {
    res.status(400).json({ message: "Specified id is not valid" });
    return;
  }

  Trip.findByIdAndUpdate(eventId, req.body, { new: true })
    .then((updatedEvent) => res.json(updatedEvent))
    .catch((err) => res.json(err));
});

//Delete an event, admin only
router.delete("/events/:eventId", (req, res, next) => {

  const eventId = req.params.eventId;

  if (!mongoose.Types.ObjectId.isValid(eventId)) {
    res.status(400).json({ message: "Specified id is not valid" });
    return;
  }

  Event.findByIdAndRemove(eventId)
    .then(() =>
      res.json({
        message: `Event has been removed successfully.`,
      })
    )
    .catch((error) => res.json(error));
});

module.exports = router;
