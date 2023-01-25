const mongoose = require("mongoose");
const { Schema, model } = mongoose;

const eventSchema = new Schema(
  {
    name: {
      type: String,
      required: [true, "Name is required."],
    },
    date: {
      type: Date,
      required: [true, "Date is required."],
    },
    image: String,
    location: {
      type: String,
      required: [true, "Location is required."],
    },
    description: String,
    linkToTickets: String,
    attendees: [{ type: Schema.Types.ObjectId, ref: "User" }],
    tripsOrganized: [{ type: Schema.Types.ObjectId, ref: "Trip" }],
  },
  {
    timestamps: true,
  }
);

module.exports = model("Event", eventSchema);
