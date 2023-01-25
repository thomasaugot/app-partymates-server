const express = require("express");
const bcrypt = require("bcrypt");
const mongoose = require("mongoose");

const Event = require("../models/Event.model");
const isCreator = require("../middleware/isAdmin");
const isAuthenticated = require("../middleware/jwt.middleware");

//  Retrieves all the trips
router.get("/trips", (req, res, next) => {
  Trip.find()
    .populate("trips")
    .then((allTrips) => res.json(allTrips))
    .catch((err) => res.json(err));
});

// Creates a new trip, Logged in only
router.post("/trips", isAuthenticated, (req, res, next) => {
  const { eventName, date, location, seatsAvailable, description } = req.body;

  Trip.create({ eventName, date, location, seatsAvailable, description })
    .then((newTrip) => {
      return Event.findByIdAndUpdate(eventId, {
        $push: { trip: newTrip._id },
      });
    })
    .then((response) => res.json(response))
    .catch((err) => res.json(err));
});

// Retrieves a specific trip by id
router.get("/trips/:tripId", (req, res, next) => {
  const { tripId } = req.params;

  if (!mongoose.Types.ObjectId.isValid(tripId)) {
    res.status(400).json({ message: "Specified id is not valid" });
    return;
  }
});

// Updates a specific trip by id, creator only
router.put("/trips/:tripId", isCreator, isAuthenticated, (req, res, next) => {
  const { tripId } = req.params;

  if (!mongoose.Types.ObjectId.isValid(tripId)) {
    res.status(400).json({ message: "Specified id is not valid" });
    return;
  }

  Trip.findByIdAndUpdate(tripId, req.body, { new: true })
    .then((updatedTrip) => res.json(updatedTrip))
    .catch((err) => res.json(err));
});

//Delete a trip, creator only
router.post("/trips/:tripId", isCreator, isAuthenticated, (req, res, next) => {
  Trip.findByIdAndDelete(req.params)
    .then(() => {
      res.redirect("/trips");
    })
    .catch((err) => {
      console.log("Error deleting event...", err);
      next();
    });
});

module.exports = router;