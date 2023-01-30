const express = require("express");
const bcrypt = require("bcrypt");
const mongoose = require("mongoose");
const router = express.Router();

const Trip = require("../models/Trip.model");
const Event = require("../models/Event.model");
const isCreator = require("../middleware/isAdmin");
const { isAuthenticated } = require("../middleware/jwt.middleware");

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

  Trip.create({ description, eventName: eventId, creator })
    .then((newTrip) => {
      return Event.findByIdAndUpdate(eventId, {
        $push: { tripsOrganized: newTrip._id },
      });
    })
    .then((response) => res.json(response))
    .catch((err) => res.json(err));
});

// Render a specific trip by id
router.get("/trips/:tripId", (req, res, next) => {
  const tripId = req.params.tripId;

  if (!mongoose.Types.ObjectId.isValid(tripId)) {
    res.status(400).json({ message: "Specified id is not valid" });
    return;
  }

  Trip.findById(tripId)
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

  Trip.findByIdAndRemove(tripId)
    .then(() =>
      res.json({
        message: `Trip has been removed successfully.`,
      })
    )
    .catch((error) => res.json(error));
});

module.exports = router;
