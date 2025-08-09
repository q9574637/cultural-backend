import Volunteer from '../models/Volunteer.js';

// Register a new volunteer
export const registerVolunteer = async (req, res) => {
    try {
        const { name, email, phone, rolePreference, events } = req.body;

        const newVolunteer = new Volunteer({
            name,
            email,
            phone,
            rolePreference,
            events
        });

        await newVolunteer.save();
        res.status(201).json({ message: "Volunteer registered successfully!", volunteer: newVolunteer });
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

// Get all volunteers
export const getVolunteers = async (req, res) => {
    try {
        const volunteers = await Volunteer.find();
        res.status(200).json(volunteers);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Update application status
export const updateStatus = async (req, res) => {
    try {
        const { id } = req.params;
        const { applicationStatus } = req.body;

        const updatedVolunteer = await Volunteer.findByIdAndUpdate(
            id,
            { applicationStatus },
            { new: true }
        );

        if (!updatedVolunteer) {
            return res.status(404).json({ message: "Volunteer not found" });
        }

        res.status(200).json({ message: "Status updated successfully!", volunteer: updatedVolunteer });
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};
