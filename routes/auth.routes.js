const express = require("express");
const router = express.Router();
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

// Require the models in order to interact with the database
const User = require("../models/User.model");

// Require necessary (isAuthenticated) middleware in order to control access to specific routes
const { isAuthenticated } = require("../middleware/jwt.middleware.js");
const saltRounds = 10;

// POST /auth/signup  - Creates a new user in the database
router.post("/signup", (req, res, next) => {
  const { email, password, name } = req.body;

  // Check if email or password or name are provided as empty strings
  if (email === "" || password === "" || name === "") {
    res.status(400).json({ message: "Provide email, password and name" });
    return;
  }

  // This regular expression check that the email is of a valid format
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
  if (!emailRegex.test(email)) {
    res.status(400).json({ message: "Provide a valid email address." });
    return;
  }

  // This regular expression checks password for special characters and minimum length
  const passwordRegex = /(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{6,}/;
  if (!passwordRegex.test(password)) {
    res.status(400).json({
      message:
        "Password must have at least 6 characters and contain at least one number, one lowercase and one uppercase letter.",
    });
    return;
  }

  // Check the users collection if a user with the same email already exists
  User.findOne({ email })
    .then((foundUser) => {
      // If the user with the same email already exists, send an error response
      if (foundUser) {
        res.status(400).json({ message: "User already exists." });
        return;
      }

      // If email is unique, proceed to hash the password
      const salt = bcrypt.genSaltSync(saltRounds);
      const hashedPassword = bcrypt.hashSync(password, salt);

      // Create the new user in the database
      // We return a pending promise, which allows us to chain another `then`
      return User.create({ email, password: hashedPassword, name: name });
    })
    .then((createdUser) => {
      // Deconstruct the newly created user object to omit the password
      // We should never expose passwords publicly
      const { email, name, _id } = createdUser;

      // Create a new object that doesn't expose the password
      const user = { email, name, _id };

      // Send a json response containing the user object
      res.status(201).json({ user: user });
    })
    .catch((err) => next(err)); // In this case, we send error handling to the error handling middleware.
});

// POST  /auth/login - Verifies email and password and returns a JWT
router.post("/login", (req, res, next) => {
  const { email, password } = req.body;

  // Check if email or password are provided as empty string
  if (email === "" || password === "") {
    res.status(400).json({ message: "Provide email and password." });
    return;
  }

  // Check the users collection if a user with the same email exists
  User.findOne({ email })
    .then((foundUser) => {
      if (!foundUser) {
        // If the user is not found, send an error response
        res.status(401).json({ message: "User not found." });
        return;
      }

      // Compare the provided password with the one saved in the database
      const passwordCorrect = bcrypt.compareSync(password, foundUser.password);

      if (passwordCorrect) {
        // Deconstruct the user object to omit the password
        const { _id, email, name } = foundUser;

        // Create an object that will be set as the token payload
        const payload = { _id, email, name };

        // Create a JSON Web Token and sign it
        const authToken = jwt.sign(payload, process.env.TOKEN_SECRET, {
          algorithm: "HS256",
          expiresIn: "6h",
        });

        // Send the token as the response
        res.status(200).json({ authToken: authToken });
      } else {
        res.status(401).json({ message: "Unable to authenticate the user" });
      }
    })
    .catch((err) => next(err)); // In this case, we send error handling to the error handling middleware.
});

// GET  /auth/verify  -  Used to verify JWT stored on the client
router.get("/verify", isAuthenticated, (req, res, next) => {
  // If JWT token is valid the payload gets decoded by the
  // isAuthenticated middleware and is made available on `req.payload`
  console.log(`req.payload`, req.payload);

  // Send back the token payload object containing the user data
  res.status(200).json(req.payload);
});

// GET user profile
router.get("/profile/:userId", isAuthenticated, (req, res, next) => {
  const userId = req.params.userId;

  User.findById(userId)
    .populate({
      path: "trips",
      populate: {
        path: "creator eventName",
        select: "-password",
      },
    })
    .populate("eventsAttending")
    .then((response) => {
      console.log(response);
      res.json(response);
    })
    .catch((err) => {
      console.log(err);
      res.json(err);
    });
});

// GET edit profile page
router.get("/profile/:userId/edit", isAuthenticated, (req, res, next) => {
  const userId = req.payload._id;

  User.findById(userId)
    .populate("name")
    .populate("trips")
    .then((userInSession) => {
      res.render("users/edit-profile", { userInSession });
    })
    .catch((error) => {
      console.log(`Error updating user: ${error}`);
      next();
    });
});

// POST edit profile
router.post("/profile/:userId/edit", isAuthenticated, (req, res, next) => {
  const userId = req.payload._id;

  let { name, email, password } = req.body;

  User.findByIdAndUpdate(userId, { name, email, password }, { new: true })
    .then((updatedUser) => {
      req.session.currentUser = updatedUser;
      res.redirect(`/auth/profile/${userId}`);
    })
    .catch((error) => {
      res.redirect("/");
      console.log(`Error updating user profile: ${error}`);
      next();
    });
});

//add events to favorites
router.put("/profile/:userId/favorites/:eventId", isAuthenticated, (req, res, next) => {
  const eventId = req.params.eventId;
  const userId = req.payload._id;
  console.log(userId);

  User.findById(userId)
    .then((response) => {
      if (response.eventsAttending.includes(eventId)) {
        return User.findByIdAndUpdate(
          userId,
          { $pull: { eventsAttending: eventId } },
          { new: true }
        );
      } else {
        return User.findByIdAndUpdate(
          userId,
          { $push: { eventsAttending: eventId } },
          { new: true }
        );
      }
    })
    .then((updatedUser) => res.json(updatedUser))
    .catch((err) => {
      console.log("error getting favorites from DB", err);
      next(err);
    });
});

const multer = require("multer");

// Set the destination folder for uploaded files
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "uploads/");
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + "-" + file.originalname);
  },
});

const fileUploader = multer({ storage: storage });

// Route for handling file uploads
router.post("/upload", fileUploader.single("file"), function (req, res) {
  // Do something with the uploaded file
  console.log(req.file);
});

module.exports = router;
