const mongoose = require("mongoose");
const { ObjectId } = mongoose.Schema.Types;

const ConversationSchema = new mongoose.Schema(
  {
    isGroup: {
      type: Boolean,
      default: false
    },

    name: {
      type: String,
      trim: true
    },

    createdBy: {
      type: ObjectId,
      ref: "User"
    },

    lastMessage: {
      type: ObjectId,
      ref: "Message"
    }
  },
  { timestamps: true }
);

ConversationSchema.index({ updatedAt: -1 });

module.exports = mongoose.model("Conversation", ConversationSchema);
