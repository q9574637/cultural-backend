
import mongoose from "mongoose";  

const TicketSchema = new mongoose.Schema({
  holderName: { type: String, required: true },
  phone: { type: String, required: true },
  email: { type: String, required: true },
  foodCoupon: { type: Number, default: 100 },
  active: { type: Boolean, default: true }, // mark presence
  checkedIn: { type: Boolean, default: false }, // mark presence
  eventDay: { type: Number, enum: [1, 2], required: true },
  qr: { type: String, required: true}, // unique code for scanning
}, { timestamps: true });

const Ticket = mongoose.model("Ticket", TicketSchema);
export default Ticket;
