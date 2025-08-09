import { initializeGoogleSheets, initializeAllSheets } from './config/googleSheets.js';
import { connectDB, User, Event, Volunteer, Registration, Committee, Application } from './models/index.js';
import bcrypt from 'bcryptjs';

// Mock data
const mockUsers = [
  {
    name: "Admin User",
    email: "admin@culturalbackend.com",
    password: "admin123",
    role: "admin",
    isActive: true
  },
  {
    name: "John Committee",
    email: "john@committee.com",
    password: "committee123",
    role: "committee",
    isActive: true
  },
  {
    name: "Alice Student",
    email: "alice@student.com",
    password: "student123",
    role: "user",
    isActive: true
  },
  {
    name: "Bob Volunteer",
    email: "bob@volunteer.com",
    password: "volunteer123",
    role: "user",
    isActive: true
  },
  {
    name: "Carol Participant",
    email: "carol@participant.com",
    password: "participant123",
    role: "user",
    isActive: true
  }
];

const mockEvents = [
  {
    title: "Annual Cultural Festival",
    description: "A grand celebration of diverse cultures with music, dance, and food from around the world.",
    date: "2024-12-15",
    time: "18:00",
    location: "Main Auditorium",
    category: "cultural",
    maxParticipants: 200,
    registrationDeadline: "2024-12-10",
    imageUrl: "https://example.com/cultural-festival.jpg",
    status: "active",
    currentParticipants: 0
  },
  {
    title: "Tech Innovation Workshop",
    description: "Learn about the latest technologies and innovations in software development.",
    date: "2024-11-25",
    time: "14:00",
    location: "Computer Lab A",
    category: "technical",
    maxParticipants: 50,
    registrationDeadline: "2024-11-20",
    imageUrl: "https://example.com/tech-workshop.jpg",
    status: "active",
    currentParticipants: 0
  },
  {
    title: "Sports Day Championship",
    description: "Inter-department sports competition with various indoor and outdoor games.",
    date: "2024-12-01",
    time: "09:00",
    location: "Sports Complex",
    category: "sports",
    maxParticipants: 100,
    registrationDeadline: "2024-11-25",
    imageUrl: "https://example.com/sports-day.jpg",
    status: "active",
    currentParticipants: 0
  },
  {
    title: "Art Exhibition",
    description: "Showcase of student artwork including paintings, sculptures, and digital art.",
    date: "2024-11-30",
    time: "10:00",
    location: "Art Gallery",
    category: "cultural",
    maxParticipants: 80,
    registrationDeadline: "2024-11-28",
    imageUrl: "https://example.com/art-exhibition.jpg",
    status: "active",
    currentParticipants: 0
  },
  {
    title: "Career Guidance Seminar",
    description: "Expert advice on career planning and job opportunities in various fields.",
    date: "2024-12-05",
    time: "15:00",
    location: "Conference Hall",
    category: "educational",
    maxParticipants: 150,
    registrationDeadline: "2024-12-03",
    imageUrl: "https://example.com/career-seminar.jpg",
    status: "active",
    currentParticipants: 0
  }
];

const mockVolunteers = [
  {
    name: "David Helper",
    email: "david@helper.com",
    phone: "+1234567890",
    department: "Computer Science",
    year: "3rd Year",
    skills: "Event Management, Photography",
    availability: "Weekends",
    experience: "2 years of event volunteering",
    status: "active"
  },
  {
    name: "Emma Support",
    email: "emma@support.com",
    phone: "+1234567891",
    department: "Business Administration",
    year: "2nd Year",
    skills: "Communication, Organization",
    availability: "Evenings",
    experience: "New volunteer",
    status: "active"
  },
  {
    name: "Frank Coordinator",
    email: "frank@coordinator.com",
    phone: "+1234567892",
    department: "Engineering",
    year: "4th Year",
    skills: "Technical Support, Leadership",
    availability: "Flexible",
    experience: "3 years of technical volunteering",
    status: "active"
  }
];

const mockCommittee = [
  {
    name: "Sarah President",
    email: "sarah@president.com",
    position: "President",
    department: "Student Affairs",
    responsibilities: "Overall event coordination and leadership",
    contactNumber: "+1234567893",
    isActive: true
  },
  {
    name: "Mike Secretary",
    email: "mike@secretary.com",
    position: "Secretary",
    department: "Administration",
    responsibilities: "Documentation and communication",
    contactNumber: "+1234567894",
    isActive: true
  },
  {
    name: "Lisa Treasurer",
    email: "lisa@treasurer.com",
    position: "Treasurer",
    department: "Finance",
    responsibilities: "Budget management and financial planning",
    contactNumber: "+1234567895",
    isActive: true
  }
];

async function seedDatabase() {
  try {
    console.log('🌱 Starting database seeding...\n');

    // Initialize Google Sheets
    console.log('1. Initializing Google Sheets...');
    await initializeGoogleSheets();
    await initializeAllSheets();
    await connectDB();
    console.log('✅ Google Sheets initialized\n');

    // Seed Users
    console.log('2. Seeding Users...');
    const createdUsers = [];
    for (const userData of mockUsers) {
      try {
        // Check if user already exists
        const existingUser = await User.findOne({ email: userData.email });
        if (existingUser) {
          console.log(`   ⚠️  User ${userData.email} already exists, skipping...`);
          createdUsers.push(existingUser);
          continue;
        }

        // Hash password
        const hashedPassword = await bcrypt.hash(userData.password, 12);
        
        const user = await User.create({
          ...userData,
          password: hashedPassword
        });
        
        createdUsers.push(user);
        console.log(`   ✅ Created user: ${userData.name} (${userData.email})`);
      } catch (error) {
        console.log(`   ❌ Error creating user ${userData.email}: ${error.message}`);
      }
    }

    // Seed Events
    console.log('\n3. Seeding Events...');
    const createdEvents = [];
    for (const eventData of mockEvents) {
      try {
        // Check if event already exists
        const existingEvent = await Event.findOne({ title: eventData.title });
        if (existingEvent) {
          console.log(`   ⚠️  Event "${eventData.title}" already exists, skipping...`);
          createdEvents.push(existingEvent);
          continue;
        }

        // Assign to admin user
        const adminUser = createdUsers.find(u => u.role === 'admin');
        const event = await Event.create({
          ...eventData,
          createdBy: adminUser ? adminUser._id : 'admin'
        });
        
        createdEvents.push(event);
        console.log(`   ✅ Created event: ${eventData.title}`);
      } catch (error) {
        console.log(`   ❌ Error creating event ${eventData.title}: ${error.message}`);
      }
    }

    // Seed Volunteers
    console.log('\n4. Seeding Volunteers...');
    for (const volunteerData of mockVolunteers) {
      try {
        // Check if volunteer already exists
        const existingVolunteer = await Volunteer.findOne({ email: volunteerData.email });
        if (existingVolunteer) {
          console.log(`   ⚠️  Volunteer ${volunteerData.email} already exists, skipping...`);
          continue;
        }

        await Volunteer.create(volunteerData);
        console.log(`   ✅ Created volunteer: ${volunteerData.name}`);
      } catch (error) {
        console.log(`   ❌ Error creating volunteer ${volunteerData.name}: ${error.message}`);
      }
    }

    // Seed Committee
    console.log('\n5. Seeding Committee Members...');
    for (const committeeData of mockCommittee) {
      try {
        // Check if committee member already exists
        const existingMember = await Committee.findOne({ email: committeeData.email });
        if (existingMember) {
          console.log(`   ⚠️  Committee member ${committeeData.email} already exists, skipping...`);
          continue;
        }

        await Committee.create(committeeData);
        console.log(`   ✅ Created committee member: ${committeeData.name} (${committeeData.position})`);
      } catch (error) {
        console.log(`   ❌ Error creating committee member ${committeeData.name}: ${error.message}`);
      }
    }

    // Create some sample registrations
    console.log('\n6. Creating Sample Event Registrations...');
    if (createdUsers.length > 0 && createdEvents.length > 0) {
      const regularUsers = createdUsers.filter(u => u.role === 'user');
      const sampleEvent = createdEvents[0];

      for (let i = 0; i < Math.min(3, regularUsers.length); i++) {
        try {
          const existingRegistration = await Registration.findOne({
            eventId: sampleEvent._id,
            userId: regularUsers[i]._id
          });

          if (existingRegistration) {
            console.log(`   ⚠️  Registration for ${regularUsers[i].name} already exists, skipping...`);
            continue;
          }

          await Registration.create({
            eventId: sampleEvent._id,
            userId: regularUsers[i]._id,
            registrationDate: new Date().toISOString(),
            status: 'confirmed'
          });

          // Update event participant count
          await Event.findByIdAndUpdate(sampleEvent._id, {
            currentParticipants: (parseInt(sampleEvent.currentParticipants) || 0) + 1
          });

          console.log(`   ✅ Registered ${regularUsers[i].name} for "${sampleEvent.title}"`);
        } catch (error) {
          console.log(`   ❌ Error creating registration: ${error.message}`);
        }
      }
    }

    // Create sample applications
    console.log('\n7. Creating Sample Volunteer Applications...');
    const volunteers = await Volunteer.find({});
    const events = await Event.find({});
    
    if (volunteers.length > 0 && events.length > 0) {
      for (let i = 0; i < Math.min(2, volunteers.length); i++) {
        try {
          const existingApplication = await Application.findOne({
            volunteerId: volunteers[i]._id,
            eventId: events[0]._id
          });

          if (existingApplication) {
            console.log(`   ⚠️  Application for ${volunteers[i].name} already exists, skipping...`);
            continue;
          }

          await Application.create({
            volunteerId: volunteers[i]._id,
            eventId: events[0]._id,
            applicationDate: new Date().toISOString(),
            status: 'pending',
            message: `I would like to volunteer for ${events[0].title}. I have experience in ${volunteers[i].skills}.`
          });

          console.log(`   ✅ Created application for ${volunteers[i].name}`);
        } catch (error) {
          console.log(`   ❌ Error creating application: ${error.message}`);
        }
      }
    }

    console.log('\n🎉 Database seeding completed successfully!');
    console.log('\n📊 Summary:');
    console.log(`   👥 Users: ${await User.countDocuments()}`);
    console.log(`   🎭 Events: ${await Event.countDocuments()}`);
    console.log(`   🙋 Volunteers: ${await Volunteer.countDocuments()}`);
    console.log(`   📝 Registrations: ${await Registration.countDocuments()}`);
    console.log(`   🏛️ Committee Members: ${await Committee.countDocuments()}`);
    console.log(`   📋 Applications: ${await Application.countDocuments()}`);

    console.log('\n🔐 Test Login Credentials:');
    console.log('   Admin: admin@culturalbackend.com / admin123');
    console.log('   Committee: john@committee.com / committee123');
    console.log('   User: alice@student.com / student123');

  } catch (error) {
    console.error('❌ Error seeding database:', error);
    process.exit(1);
  }
}

// Run seeding
seedDatabase();
