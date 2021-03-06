const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const storySchema = new Schema(
  {
    imageUrl: {
      type: String,
      required: true,
    },
    creator: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Story", storySchema);
