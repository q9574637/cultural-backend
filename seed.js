import connectDb from "./Config/Connection.js";
import User from "./models/User.js";
import Event from "./models/Events.js";
import CommitteeMember from "./models/CommitteeMember.js";
import bcrypt from "bcryptjs";

const seedData = async () => {
  try {
    await connectDb();
    console.log("Connected to database");

    // Clear existing data
    await User.deleteMany({});
    await Event.deleteMany({});
    await CommitteeMember.deleteMany({});
    console.log("Cleared existing data");

    // Create super admin user
    const hashedPassword = await bcrypt.hash("admin123", 10);
    const superAdmin = new User({
      name: "Super Admin",
      email: "superadmin@nuvoriya.com",
      password: hashedPassword,
      role: "super_admin",
      profile: { phone: "+91 98765 43210" }
    });
    await superAdmin.save();
    console.log("Created super admin user");

    // Create sample events
    const events = [
      {
        title: "Parampara Parade",
        category: "Fashion",
        description: "Showcase of ethnic fashion from different states",
        fullDescription: "Parampara Parade is a vibrant fashion show celebrating the rich ethnic heritage of India. Teams will showcase traditional costumes from different states, highlighting the diversity and beauty of Indian culture through fashion.",
        prize: "₹15,000",
        date: "September 20",
        time: "2:00 PM",
        participants: "6-8 per team",
        venue: "Main Auditorium",
        duration: "7 minutes",
        posterImage: "/placeholder.svg?height=400&width=300&text=Parampara+Parade",
        rules: [
          "Minimum of 6 to 8 participants per team",
          "Attractive costumes is mandatory and No form of vulgarity is encouraged",
          "THEME: Showcase of ethnic fashion from different states",
          "Time allotted: 7 minutes",
          "Focus on traditional and cultural authenticity",
        ],
        organizer: superAdmin._id,
        status: "active"
      },
      {
        title: "Bloody Sweet Bangerz",
        category: "Dance",
        description: "High-energy group dance competition",
        fullDescription: "Bloody Sweet Bangerz is an electrifying group dance competition that brings together the most talented dance crews. Teams will showcase their choreographic skills, creativity, and stage presence in this high-energy battle.",
        prize: "₹12,000",
        date: "September 20",
        time: "4:00 PM",
        participants: "6-8 per team",
        venue: "Open Air Theatre",
        duration: "5 minutes",
        posterImage: "/placeholder.svg?height=400&width=300&text=Bloody+Sweet+Bangerz",
        rules: [
          "Minimum of 6 to 8 participants per team",
          "Attractive costumes is mandatory and no form of vulgarity is encouraged",
          "Time allotted: 5 minutes",
          "Vulgarity in any form will lead to disqualification",
          "Original choreography preferred",
        ],
        organizer: superAdmin._id,
        status: "active"
      },
      {
        title: "Jam Warfare",
        category: "Music",
        description: "Group singing and band competition",
        fullDescription: "Jam Warfare is the ultimate musical battleground where bands and vocal groups compete in an intense singing competition. Whether you're a solo artist or a full band, this is your stage to shine.",
        prize: "₹10,000",
        date: "September 21",
        time: "10:00 AM",
        participants: "6-8+ members",
        venue: "Music Hall",
        duration: "Variable",
        posterImage: "/placeholder.svg?height=400&width=300&text=Jam+Warfare",
        rules: [
          "Minimum of 6 to 8 or more than that if you are band with instruments",
          "Karaoke and instruments can be used based on your preference",
          "Song Language: Any language is allowed. But songs must be appropriate and respectful",
          "Only non-vulgar, non-political songs. Obscene or offensive content will lead to disqualification",
          "Bring your own instruments and cables. Basic sound system (mic/speakers) will be provided",
        ],
        organizer: superAdmin._id,
        status: "active"
      }
    ];

    const savedEvents = await Event.insertMany(events);
    console.log("Created sample events");

    // Create admin user assigned to first event
    const adminPassword = await bcrypt.hash("admin123", 10);
    const admin = new User({
      name: "Event Admin",
      email: "admin@nuvoriya.com",
      password: adminPassword,
      role: "admin",
      assignedEventId: savedEvents[0]._id,
      profile: { phone: "+91 98765 43211" }
    });
    await admin.save();
    console.log("Created admin user");

    // Create committee members
    const committeeMembers = [
      {
        name: "Arjun Kumar",
        position: "Festival Director",
        phone: "+91 98765 43210",
        email: "arjun@nuvoriya.com",
        image: "/placeholder.svg?height=200&width=200&text=Arjun+Kumar",
        order: 1
      },
      {
        name: "Priya Sharma",
        position: "Cultural Coordinator",
        phone: "+91 98765 43211",
        email: "priya@nuvoriya.com",
        image: "/placeholder.svg?height=200&width=200&text=Priya+Sharma",
        order: 2
      },
      {
        name: "Karthik Raj",
        position: "Events Manager",
        phone: "+91 98765 43212",
        email: "karthik@nuvoriya.com",
        image: "/placeholder.svg?height=200&width=200&text=Karthik+Raj",
        order: 3
      },
      {
        name: "Meera Nair",
        position: "Registration Head",
        phone: "+91 98765 43213",
        email: "meera@nuvoriya.com",
        image: "/placeholder.svg?height=200&width=200&text=Meera+Nair",
        order: 4
      },
      {
        name: "Vikram Singh",
        position: "Technical Lead",
        phone: "+91 98765 43214",
        email: "vikram@nuvoriya.com",
        image: "/placeholder.svg?height=200&width=200&text=Vikram+Singh",
        order: 5
      },
      {
        name: "Ananya Iyer",
        position: "Marketing Head",
        phone: "+91 98765 43215",
        email: "ananya@nuvoriya.com",
        image: "/placeholder.svg?height=200&width=200&text=Ananya+Iyer",
        order: 6
      }
    ];

    await CommitteeMember.insertMany(committeeMembers);
    console.log("Created committee members");

    console.log("✅ Database seeded successfully!");
    console.log("\n📋 Login Credentials:");
    console.log("Super Admin: superadmin@nuvoriya.com / admin123");
    console.log("Event Admin: admin@nuvoriya.com / admin123");
    
    process.exit(0);
  } catch (error) {
    console.error("❌ Error seeding database:", error);
    process.exit(1);
  }
};

seedData(); 