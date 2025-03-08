const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const subscriptionSchema = new Schema(
  {
    subscriber: {
      type: Schema.Types.ObjectId, // one who IS SUBSCRIBING
      ref: 'User'
    },
    channel:{
        type: Schema.Types.ObjectId, // one to whom `subscriber` IS SUBSCRIBING
        ref: 'User'
    },
  },
  {
    timestamps: true,
  }
);

const Subscription = mongoose.model("Subscription", subscriptionSchema);
module.exports = Subscription;
