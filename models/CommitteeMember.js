import mongoose from "mongoose";

const CommitteeMemberSchema = new mongoose.Schema({
  name: { type: String, required: true },
  position: { type: String, required: true }, // e.g., "Festival Director", "Cultural Coordinator"
  phone: { type: String, required: true },
  email: { type: String, required: true },
  image: { type: String, required: true }, // URL to the image

  // Additional fields for future extensibility
  bio: { type: String },
  socialLinks: {
    linkedin: String,
    twitter: String,
    instagram: String,
  },

  isActive: { type: Boolean, default: true },
  order: { type: Number, default: 0 }, // For display order
}, {
  timestamps: true,
});

const CommitteeMember = mongoose.model("CommitteeMember", CommitteeMemberSchema);
export default CommitteeMember; 