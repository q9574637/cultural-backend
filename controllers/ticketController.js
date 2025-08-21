// controllers/ticketController.j
import QRCode from "qrcode";
import Ticket from "../models/Ticket.js";

// Create Ticket
export const createTicket = async (req, res) => {
  try {
    const { holderName, phone, email, eventDay } = req.body;
    
    // QR Code Data
    if (!holderName || !phone || !email || !eventDay) return res.status(400).json({ message: "Missing required fields" });
    if (eventDay !== 1 && eventDay !== 2) return res.status(400).json({ message: "Invalid event day" });


    const ticketsByPhone = await Ticket.find({ phone });
    if (ticketsByPhone.length > 0) return res.status(400).json({ message: "Ticket already exists" });

    const ticketsByEmail = await Ticket.find({email });
    if (ticketsByEmail.length> 0) return res.status(400).json({ message: "Ticket already exists" });
    
   
   // if (!qrCode) return res.status(500).json({ message: "QR code generation failed" });
    const ticket = await Ticket.create({
      holderName,
      phone,
      email,
      eventDay,
      qr: "email"
    });

    const qrData = `${ticket._id}`;
    const qrCode = await QRCode.toDataURL(qrData);
    ticket.qr = qrCode;
    await ticket.save();
    res.status(201).json(ticket);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get All Tickets
export const getTickets = async (req, res) => {
  try {
    const tickets = await Ticket.find();
    res.json(tickets);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get Ticket by ID
export const getTicketById = async (req, res) => {
  try {
    const ticket = await Ticket.findById(req.params.id);
    if (!ticket) return res.status(404).json({ message: "Ticket not found" });
    res.json(ticket);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Update Ticket
export const updateTicket = async (req, res) => {
  try {
    // Only allow these two fields to be updated
    const allowedUpdates = ["active", "checkedIn"];
    const updates = {};

    allowedUpdates.forEach((field) => {
      if (req.body[field] !== undefined) {
        updates[field] = req.body[field];
      }
    });

    if (Object.keys(updates).length === 0) {
      return res.status(400).json({ message: "No valid fields to update" });
    }

    const ticket = await Ticket.findByIdAndUpdate(
      req.params.id,
      updates,
      { new: true }
    );

    if (!ticket) {
      return res.status(404).json({ message: "Ticket not found" });
    }

    res.json(ticket);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Delete Ticket
export const deleteTicket = async (req, res) => {

  try {

    await Ticket.findByIdAndDelete(req.params.id);


    res.json({ message: "Ticket deleted" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


export const verifyTicket = async (req, res) => {
  try {
    const ticket = await Ticket.findById(req.params.id);
    if (!ticket) return res.status(404).json({ message: "Ticket not found" });

    ticket.checkedIn = true;

    await ticket.save();

    res.json({ message: "Ticket checked in", ticket });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

