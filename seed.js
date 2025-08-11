import mongoose from "mongoose";
import dotenv from "dotenv";
import StaticContent from "./models/staticContent.model.js";

dotenv.config();

const mockData = {
  festivalName: "VARNAVE'25",
  festivalDates: "September 12-13, 2025",
  festivalLocation: "Coimbatore",
  heroSubtitle: "Cultural Festival • September 12-13, 2025 • Coimbatore",
  stats: {
    eventsCount: "20+",
    eventsLabel: "Events",
    celebrationDuration: "3 Days",
    celebrationLabel: "Celebration",
    participantsCount: "5000+",
    participantsLabel: "Participants",
  },
  aboutTitle: "ABOUT VARNAVE'25",
  aboutDescription:
    "Varnave'25 is the premier cultural festival celebrating the rich heritage of Tamil arts, cinema, music, and performing arts. Join us for three days of extraordinary performances, competitions, and cultural immersion in the heart of Coimbatore.",
  aboutFeatures: [
    {
      title: "3 DAYS",
      subtitle: "OF CELEBRATION",
      description: "Non-stop entertainment with 30+ events across multiple categories",
      gradient: "from-blue-500 to-purple-500",
    },
    {
      title: "₹1 LAKH+",
      subtitle: "PRIZE MONEY",
      description: "Exciting cash prizes and recognition for winners",
      gradient: "from-orange-500 to-yellow-500",
    },
    {
      title: "5000+",
      subtitle: "PARTICIPANTS",
      description: "Students from across Tamil Nadu and beyond",
      gradient: "from-pink-500 to-red-500",
    },
  ],
  eventsTitle: "EVENTS & COMPETITIONS",
  registerTitle: "REGISTER NOW",
  registerDescription: "Secure your spot at the grandest Tamil cultural celebration",
  registerFormTitle: "EVENT REGISTRATION",
  registerFormDescription: "Register for events and competitions via Google Forms.",
  registerButtonText: "REGISTER VIA GOOGLE FORM",
  registerDisclaimer: "Click the button to proceed to the Google Form for registration.",
  eventRegistrationFormUrl: "https://forms.gle/YourEventRegistrationFormLink",
  volunteerTitle: "BE A VOLUNTEER",
  volunteerDescription: "Join our dedicated team and help make Varnave'25 a grand success!",
  volunteerFormTitle: "VOLUNTEER REGISTRATION",
  volunteerFormDescription: "Contribute to the festival and gain valuable experience.",
  volunteerButtonText: "APPLY TO VOLUNTEER",
  volunteerDisclaimer: "Applications close September 1, 2025",
  volunteerRegistrationFormUrl: "https://forms.gle/JEz272bQkz7HEjks6",
  committeeTitle: "CORE COMMITTEE",
  committeeDescription: "Meet the dedicated team behind Varnave'25",
  footerDescription:
    "The premier Tamil cultural festival celebrating arts, cinema, music, and performing arts.",
  footerQuickLinks: ["About", "Events", "Register", "Volunteer", "Contact"],
  footerEventInfo: {
    date: "September 12-13, 2025",
    location: "Coimbatore, Tamil Nadu",
    phone: "+91 98765 43210",
  },
  socialMediaLinks: {
    instagram: "https://instagram.com",
    facebook: "https://facebook.com",
    twitter: "https://twitter.com",
  },
  copyrightText:
    "© 2025 Varnave. All rights reserved. Made with ❤️ for Tamil culture.",
};

async function seedStaticContent() {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log("✅ MongoDB Connected");

    const existing = await StaticContent.findOne();
    if (existing) {
      console.log("⚠️ Static content already exists. Skipping seed.");
      process.exit(0);
    }

    await StaticContent.create(mockData);
    console.log("🎉 Static content seeded successfully!");
    process.exit(0);
  } catch (err) {
    console.error("❌ Error seeding static content:", err);
    process.exit(1);
  }
}

seedStaticContent();
