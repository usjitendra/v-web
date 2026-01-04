const mongoose = require("mongoose");
const { ObjectId } = mongoose.Schema.Types;

const ConversationMemberSchema = new mongoose.Schema(
  {

    conversationId: {
      type: ObjectId,
      ref: "Conversation",
      required: true
    },

    userId: {
      type: ObjectId,
      ref: "User",
      required: true
    },

    role: {
      type: String,
      enum: ["superAdmin", "admin", "techStudent", "user"],
      default: "user"
    },

    lastReadMessageId: {
      type: ObjectId,
      ref: "Message"
    },

    isMuted: {
      type: Boolean,
      default: false
    },

    isBlocked: {
      type: Boolean,
      default: false
    },

    joinedAt: {
      type: Date,
      default: Date.now
    }
  },
  { timestamps: true }
);

ConversationMemberSchema.index(
  { conversationId: 1, userId: 1 },
  { unique: true }
);

module.exports = mongoose.model("ConversationMember", ConversationMemberSchema);
