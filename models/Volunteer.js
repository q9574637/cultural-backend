import mongoose from "mongoose";

const volunteerSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true
    },
    email: {
        type: String,
        required: true,
        unique: true,
        lowercase: true
    },
    phone: {
        type: String,
        required: true
    },
    rolePreference: {
        type: [String], // e.g. ["Stage Management", "Registration", "Logistics"]
        required: true
    },
    events: {
        type: [String], // e.g. ["Dance", "Music", "Drama"]
        required: true
    },
    applicationStatus: {
        type: String,
        enum: ["Pending", "Accepted", "Rejected"],
        default: "Pending"
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});

const Volunteer = mongoose.model("Volunteer", volunteerSchema);
export default Volunteer;

