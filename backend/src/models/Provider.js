const mongoose = require("mongoose");

const providerSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      unique: true,
    },

    phone: {
      type: String,
      default: "",
    },

    profilePhoto: {
      type: String,
      default: "",
    },

    categories: [
      {
        type: String,
      },
    ],

    skills: [
      {
        type: String,
      },
    ],

    experience: {
      type: Number,
      default: 0,
    },

    location: {
      city: {
        type: String,
        default: "",
      },
      state: {
        type: String,
        default: "",
      },
      address: {
        type: String,
        default: "",
      },
    },

    documents: [
      {
        name: String,
        url: String,
        uploadedAt: {
          type: Date,
          default: Date.now,
        },
      },
    ],

    applicationStatus: {
      type: String,
      enum: ["draft", "pending", "approved", "rejected"],
      default: "draft",
    },

    rejectionRemark: {
      type: String,
      default: "",
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Provider", providerSchema);