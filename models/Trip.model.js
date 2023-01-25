const mongoose = require("mongoose");
const { Schema, model } = mongoose;

const tripSchema = new Schema(
  {
    eventName: {
      type: Schema.Types.ObjectId,
      ref: "Event",
      required: true,
    },
    date: {
      type: Date,
      required: [true, "Please indicate your date and time of departure"],
    },
    location: {
      type: String,
      required: [true, "Please indicate where you will depart from"],
    },
    seatsAvailable: Number,
    description: String,
    creator: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
  },
  {
    timestamps: true,
  }
);

module.exports = model("Trip", tripSchema);
