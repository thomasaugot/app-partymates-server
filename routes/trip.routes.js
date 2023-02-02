const express = require("express");
const bcrypt = require("bcrypt");
const mongoose = require("mongoose");
const router = express.Router();

const Trip = require("../models/Trip.model");
const Event = require("../models/Event.model");
const isCreator = require("../middleware/isAdmin");
const { isAuthenticated } = require("../middleware/jwt.middleware");
const User = require("../models/User.model");

//  Retrieves all the trips
router.get("/trips", (req, res, next) => {
  Trip.find()
    .populate("creator", "-password")
    .then((allTrips) => {
      console.log(allTrips);
      res.json(allTrips);
    })
    .catch((err) => res.json(err));
});

// Creates a new trip, Logged in only
router.post("/trips", isAuthenticated, (req, res, next) => {
  const { description, eventId } = req.body;
  const creator = req.payload._id;

  let newTrip;

  Trip.create({ description, eventName: eventId, creator })
    .then((tripFromDB) => {
      newTrip = tripFromDB;
      return Event.findByIdAndUpdate(eventId, {
        $push: { tripsOrganized: tripFromDB._id },
      });
    })
    .then((response) => {
      return User.findByIdAndUpdate(creator, {
        $push: { trips: newTrip._id },
      });
    })
    .then((response) => res.json(response))
    .catch((err) => {
      console.log("error adding trip...", err);
      res.status(500).json(err);
    });
});

// Render a specific trip by id
router.get("/trips/:tripId", (req, res, next) => {
  const tripId = req.params.tripId;

  if (!mongoose.Types.ObjectId.isValid(tripId)) {
    res.status(400).json({ message: "Specified id is not valid" });
    return;
  }

  Trip.findById(tripId)
    .populate({
      path: "creator eventName",
      populate: {
        path: "creator",
        select: "_id, name",
      }, 
    })
    .then((response) => res.json(response))
    .catch((err) => res.json(err));
});

// Updates a specific trip by id, creator only
router.put("/trips/:tripId", (req, res, next) => {
  const tripId = req.params.tripId;

  if (!mongoose.Types.ObjectId.isValid(tripId)) {
    res.status(400).json({ message: "Specified id is not valid" });
    return;
  }

  Trip.findByIdAndUpdate(tripId, req.body, { new: true })
    .then((updatedTrip) => res.json(updatedTrip))
    .catch((err) => res.json(err));
});

//Delete a trip, creator only
router.delete("/trips/:tripId", (req, res, next) => {
  const tripId = req.params.tripId;

  if (!mongoose.Types.ObjectId.isValid(tripId)) {
    res.status(400).json({ message: "Specified id is not valid" });
    return;
  }

  let creator
  let eventName

  Trip.findByIdAndRemove(tripId)
    .then((trip) => {
      creator = trip.creator
      eventName = trip.eventName
      return User.findByIdAndUpdate(creator, { $pull: { trips: tripId }}, { new: true })
    })
    .then((user) => {
      console.log(user)
      return Event.findByIdAndUpdate(eventName, { $pull: { tripsOrganized: tripId }}, { new: true } )
    })
    .then((response) => res.json('trip deleted everywhere'))
    .catch((error) => res.json(error));
});

module.exports = router;
