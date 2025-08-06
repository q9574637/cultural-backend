import mongoose from "mongoose";

const UserSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, unique: true, required: true },
  password: { type: String, required: true },

  role: {
    type: String,
    enum: ["super_admin", "admin", "user"],
    default: "user"
  },

  // For admins assigned to specific events
  assignedEventId: { type: mongoose.Schema.Types.ObjectId, ref: "Event" },

  profile: {
    phone: String,
    avatar: String,
  },

  isActive: { type: Boolean, default: true },
}, {
  timestamps: true,
});

const User = mongoose.model("User", UserSchema);
export default User;
