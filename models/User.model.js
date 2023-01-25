const { Schema, model } = require("mongoose");

const userSchema = new Schema(
  {
    username: {
      type: String,
      required: [true, "Please choose a username"],
      unique: true,
      trim: true,
    },
    email: {
      type: String,
      required: [true, "Email is required."],
      unique: true,
      lowercase: true,
      trim: true,
    },
    profilePicture: {
      type: String,
    },
    password: {
      type: String,
      required: [true, "Password is required."],
    },
    eventsAttending: [{ type: Schema.Types.ObjectId, ref: "Event" }],
    trips: [{ type: Schema.Types.ObjectId, ref: "Trip" }],
  },
  {
    timestamps: true,
  }
);

const User = model("User", userSchema);

module.exports = User;
