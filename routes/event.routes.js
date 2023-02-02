const express = require("express");
const bcrypt = require("bcrypt");
const mongoose = require("mongoose");
const router = express.Router();

const Event = require("../models/Event.model");
const Trip = require("../models/Trip.model");
const isAdmin = require("../middleware/isAdmin");
const { isAuthenticated } = require("../middleware/jwt.middleware");

// let event = req.query.name.toLowerCase;
// let mySort = { createdAt : -1 }
// let filter = {}

// if (event) {
//     filter = { name : { $eq: name }}
// }

// router.get("/events", (req, res, next) => {
//   // Event.find(filter.toLowerCase).sort(mySort)
//   Event.find()
//     .populate("name")
//     .then((allEvents) => res.json(allEvents))
//     .catch((err) => res.json(err));
// });

//  Render all the events
router.get("/events", (req, res, next) => {
  Event.find()
    .populate("attendees")
    .populate("tripsOrganized")
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
    tripsOrganized: [],
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
    .populate({
      path : 'attendees',
      select: "_id, name"
    })
    .populate({
      path : 'tripsOrganized',
      populate : {
        path : 'creator',
        select: "_id, name"
      }
    })
    .then((response) => {
      res.json(response)
    })
    .catch((err) => res.json(err));
});

// dont pass attendees to that route
router.put("/events/:eventId", (req, res, next) => {
  const eventId = req.params.eventId;
  if (!mongoose.Types.ObjectId.isValid(eventId)) {
    res.status(400).json({ message: "Specified id is not valid" });
    return;
  }

  Event.findByIdAndUpdate(eventId, req.body, { new: true })
    .then((updatedEvent) => res.json(updatedEvent))
    .catch((err) => res.json(err));
});

// Updates a specific event by id, admin only
router.put("/events/:eventId/join", isAuthenticated, (req, res, next) => {
  const eventId = req.params.eventId;
  const { _id } = req.payload
 
  console.log(req.payload)

  if (!mongoose.Types.ObjectId.isValid(eventId)) {
    res.status(400).json({ message: "Specified id is not valid" });
    return;
  }

  Event.findById(eventId)
    .then(response => {
      if (response.attendees.includes(_id)){
        return Event.findByIdAndUpdate(eventId, { $pull: { attendees: _id } }, { new: true })
      } else {
        return Event.findByIdAndUpdate(eventId, { $push: { attendees: _id } }, { new: true })
      }
    })
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
