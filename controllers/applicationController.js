import bcrypt from "bcryptjs";
import Volunteer from "../models/Volunteer.js";
import User from "../models/User.js";
import { sendApplicationAcceptedWithCredentialsEmail } from "../utils/sendMail.js";
import { generatePassword } from "../utils/generatePassword.js";

export const acceptApplication = async (req, res) => {
  try {
    const { id } = req.params;

    const volunteer = await Volunteer.findById(id);
    if (!volunteer) return res.status(404).json({ message: "Volunteer not found" });

    volunteer.applicationStatus = "accepted";
    await volunteer.save();

    // Generate password
    const plainPassword = generatePassword(10);
    const hashedPassword = await bcrypt.hash(plainPassword, 10);

    // Create user
    const user = await User.create({
      name: volunteer.name,
      email: volunteer.email,
      password: hashedPassword
    });

    // Send email with credentials
    await sendApplicationAcceptedWithCredentialsEmail(volunteer.email, volunteer.name, volunteer.email, plainPassword);

    res.status(200).json({ message: "Application accepted, user created, email sent", user });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
