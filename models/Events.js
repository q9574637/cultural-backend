import mongoose from "mongoose";

const EventSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    category: { type: String, required: true }, // e.g., "Dance", "Music", "Drama", "Visual Arts", "Gaming", "Fashion"
    description: { type: String, required: true },
    fullDescription: { type: String, required: true },
    prize: { type: String, required: true }, // e.g., "₹15,000"
    date: { type: String, required: true }, // e.g., "September 20"
    time: { type: String, required: true }, // e.g., "2:00 PM"
    participants: { type: String, required: true }, // e.g., "6-8 per team"
    venue: { type: String, required: true },
    duration: { type: String, required: true }, // e.g., "7 minutes"
    posterImage: { type: String, required: true }, // URL to the image
    rules: [{ type: String }], // Array of rules
    Link: { type: String },

    // Additional fields for future extensibility
    status: {
      type: String,
      enum: ["active", "inactive", "completed"],
      default: "active",
    },

    registrationDeadline: { type: Date },
    maxParticipants: { type: Number },
    currentParticipants: { type: Number, default: 0 },

    // Organizer information
    organizer: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },

    // ✅ Updated: Now arrays instead of strings
    StudentCoordinatorName: {
      type: [String], // Array of names
      required: true,
    },
    StudentCoordinatorPhone: {
      type: [String], // Array of phone numbers
      required: true,
    },
    StudentCoordinatorEmail: {
      type: String, // Keeping as single email (can be array if needed)
      required: true,
      default: "culturalfest2k25@gmail.com",
    },

    // Statistics
    stats: {
      totalRegistrations: { type: Number, default: 0 },
      rating: { type: Number, default: 0, min: 0, max: 5 },
      reviewCount: { type: Number, default: 0 },
    },
  },
  {
    timestamps: true,
  }
);

const Event = mongoose.model("Event", EventSchema);
export default Event;
