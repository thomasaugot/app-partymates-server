const mongoose = require("mongoose");
const { Schema, model } = mongoose;

const tripSchema = new Schema(
  {
    eventName: {
      type: Schema.Types.ObjectId,
      ref: "Event",
      required: true,
    },
    description: {
      type: String,
      required: [true, 'please provide a description before submitting' ]
    },
    // creator: {
    //   type: mongoose.Schema.Types.ObjectId,
    //   ref: "User",
    // },
  },
  {
    timestamps: true,
  }
);

module.exports = model("Trip", tripSchema);
