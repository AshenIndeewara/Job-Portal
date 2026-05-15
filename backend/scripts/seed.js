require("dotenv").config();
const mongoose = require("mongoose");
const JobRequest = require("../src/models/JobRequest");

const MONGODB_URI = process.env.MONGODB_URI || "mongodb://localhost:27017/JobPortal";

const sampleJobs = [
  {
    title: "Leaking kitchen tap needs urgent fixing",
    description: "My kitchen tap has been dripping for two weeks. Getting worse. Need someone ASAP.",
    category: "Plumbing",
    location: "Glasgow",
    contactName: "Sarah Mitchell",
    contactEmail: "sarah.mitchell@gmail.com",
    status: "Open",
  },
  {
    title: "Rewire living room sockets",
    description: "Two double sockets in the living room have stopped working. Think it's a wiring issue behind the wall.",
    category: "Electrical",
    location: "Edinburgh",
    contactName: "James Thornton",
    contactEmail: "j.thornton@gmail.com",
    status: "In Progress",
  },
  {
    title: "Full exterior house repaint",
    description: "Three-bed semi needs full exterior repaint. Currently cream, happy to keep same colour. Scaffold may be needed.",
    category: "Painting",
    location: "Aberdeen",
    contactName: "Claire Davies",
    contactEmail: "claire.d@gmail.com",
    status: "Open",
  },
  {
    title: "Custom garden gate installation",
    description: "Need a wooden gate fitted between garage and side passage. Gate already purchased, just need fitting and hinges.",
    category: "Joinery",
    location: "Inverness",
    contactName: "Tom Reid",
    contactEmail: "tomreid@gmail.com",
    status: "Open",
  },
  {
    title: "Burst pipe under bathroom sink",
    description: "Pipe under the bathroom sink has cracked. Water is shut off. Need someone today or tomorrow if possible.",
    category: "Plumbing",
    location: "Glasgow",
    contactName: "Priya Nair",
    contactEmail: "priya.nair@gmail.com",
    status: "Closed",
  },
  {
    title: "Install outdoor security lighting",
    description: "Want two PIR floodlights fitted at front and rear of property. Power supply already nearby.",
    category: "Electrical",
    location: "Dundee",
    contactName: "Mark Sutherland",
    contactEmail: "msutherland@gmail.com",
    status: "Open",
  },
  {
    title: "Bedroom and hallway repaint",
    description: "Looking for a painter to refresh a double bedroom and hallway. Ceilings and walls. Paint not yet purchased.",
    category: "Painting",
    location: "Perth",
    contactName: "Helen Foster",
    contactEmail: "helen.foster@gmail.com",
    status: "Open",
  },
  {
    title: "Skirting boards replacement throughout flat",
    description: "Old skirting boards crumbling in several rooms. Need full replacement across 4 rooms in a ground floor flat.",
    category: "Joinery",
    location: "Edinburgh",
    contactName: "Callum Brady",
    contactEmail: "callum.brady@gmail.com",
    status: "In Progress",
  },
  {
    title: "Toilet cistern not refilling",
    description: "The toilet cistern empties on flush but takes over an hour to refill. Likely the fill valve. Straightforward job.",
    category: "Plumbing",
    location: "Stirling",
    contactName: "Angela Park",
    contactEmail: "angela.park@gmail.com",
    status: "Open",
  },
  {
    title: "Consumer unit upgrade",
    description: "Old fuse box needs replacing with modern consumer unit. 3-bed house. Looking for a qualified electrician only.",
    category: "Electrical",
    location: "Glasgow",
    contactName: "Derek Muir",
    contactEmail: "d.muir@gmail.com",
    status: "Open",
  },
];

async function seed() {
  try {
    await mongoose.connect(MONGODB_URI);
    console.log("Connected to MongoDB");

    await JobRequest.deleteMany({});
    console.log("Cleared existing jobs");

    const inserted = await JobRequest.insertMany(sampleJobs);
    console.log(`Seeded ${inserted.length} jobs successfully`);
  } catch (err) {
    console.error("Seed error:", err.message);
  } finally {
    await mongoose.disconnect();
    console.log("Disconnected from MongoDB");
  }
}

seed();
