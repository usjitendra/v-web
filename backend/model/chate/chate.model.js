const mongoose = require("mongoose");
const { ObjectId } = mongoose.Schema.Types;

const MessageSchema = new mongoose.Schema(
  {
    conversationId: {
      type: ObjectId,
      ref: "Conversation",
      required: true
    },

    senderId: {
      type: ObjectId,
      ref: "User",
      required: true
    },

    messageType: {
      type: String,
      enum: ["text", "image", "file"],
      default: "text"
    },

    content: {
      type: String
    },

    media: {
      url: String,
      size: Number,
      mimeType: String
    },

    replyTo: {
      type: ObjectId,
      ref: "Message"
    },

    editedAt: {
      type: Date
    },

    deletedFor: [
      {
        type: ObjectId,
        ref: "User"
      }
    ],

    clientMessageId: {
      type: String
    }
  },
  { timestamps: true }
);

MessageSchema.index({ conversationId: 1, createdAt: -1 });
MessageSchema.index({ senderId: 1 });

module.exports = mongoose.model("Message", MessageSchema);
