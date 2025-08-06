import mongoose from "mongoose";

const EventRegistrationSchema = new mongoose.Schema({
  fullName: { type: String, required: true },
  email: { type: String, required: true },
  phone: { type: String, required: true },
  college: { type: String, required: true },
  specialRequirements: { type: String },

  eventId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Event",
    required: true,
  },

  eventName: { type: String, required: true }, // For display purposes
  registrationDate: { type: Date, default: Date.now },
  totalFee: { type: Number, required: true },

  // Payment information
  paymentStatus: {
    type: String,
    enum: ["pending", "paid", "failed", "refunded"],
    default: "pending",
  },

  paymentMethod: {
    type: String,
    enum: ["cash", "card", "bank_transfer", "upi"],
    default: "cash",
  },

  transactionId: String,

  // Registration status
  status: {
    type: String,
    enum: ["registered", "cancelled", "attended", "refunded"],
    default: "registered",
  },

  // Additional fields for future extensibility
  notes: String,
  attendedAt: Date,
  cancelledAt: Date,
  cancelledBy: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
}, {
  timestamps: true,
});

const EventRegistration = mongoose.model("EventRegistration", EventRegistrationSchema);
export default EventRegistration;
