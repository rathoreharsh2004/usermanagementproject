import "dotenv/config";
import mongoose from "mongoose";
import User from "./models/User.js";
import { connectDB } from "./config/db.js";

const sampleUsers = [
  {
    name: "Aarav Sharma",
    email: "aarav.sharma@example.com",
    phone: "+91 98765 43210",
    role: "Admin",
    status: "Active"
  },
  {
    name: "Priya Patel",
    email: "priya.patel@example.com",
    phone: "+91 98123 45678",
    role: "Manager",
    status: "Active"
  },
  {
    name: "Rohan Verma",
    email: "rohan.verma@example.com",
    phone: "+91 97654 32109",
    role: "Member",
    status: "Active"
  },
  {
    name: "Ananya Iyer",
    email: "ananya.iyer@example.com",
    phone: "+91 99887 76655",
    role: "Manager",
    status: "Inactive"
  },
  {
    name: "Vikram Malhotra",
    email: "vikram.m@example.com",
    phone: "+91 91234 56780",
    role: "Member",
    status: "Active"
  },
  {
    name: "Sneha Reddy",
    email: "sneha.reddy@example.com",
    phone: "+91 98450 12345",
    role: "Member",
    status: "Inactive"
  }
];

async function seed() {
  try {
    await connectDB();
    console.log("Connected to MongoDB for seeding...");

    const count = await User.countDocuments();
    if (count > 0) {
      console.log(`Database already has ${count} users. Clearing existing records to re-seed...`);
      await User.deleteMany({});
    }

    await User.insertMany(sampleUsers);
    console.log(`Successfully seeded ${sampleUsers.length} sample users.`);
    process.exit(0);
  } catch (error) {
    console.error("Seeding failed:", error.message);
    process.exit(1);
  }
}

seed();

