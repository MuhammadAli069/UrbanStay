// Loads the 30 sample listings into MongoDB under a demo host account.
// Safe to run more than once: existing listings are updated, not duplicated.
// Usage: npm run seed
require("dotenv").config();
const mongoose = require("mongoose");
const User = require("../models/User");
const Property = require("../models/Property");
const samples = require("../data/sampleProperties.json");

const DEMO_HOST = {
  name: "Sarah Johnson",
  email: process.env.DEMO_HOST_EMAIL || "host@urbanstay.demo",
  password: process.env.DEMO_HOST_PASSWORD || "DemoHost123",
};

const describe = (p) =>
  `${p.name} is a ${p.bedrooms}-bedroom ${p.type} in ${p.location}, sleeping up to ${p.guests} guests. ` +
  "It is thoughtfully furnished, close to local dining and transport, and has everything you need for a comfortable stay.";

(async () => {
  await mongoose.connect(process.env.MONGO_URI);

  let host = await User.findOne({ email: DEMO_HOST.email });
  if (!host) {
    host = await User.create({ ...DEMO_HOST, role: "host" });
    console.log(`Created demo host ${DEMO_HOST.email} (password: ${DEMO_HOST.password})`);
  }

  let created = 0;
  for (const sample of samples) {
    const result = await Property.updateOne(
      { listingId: sample.listingId },
      {
        $set: { ...sample, description: describe(sample) },
        $setOnInsert: { host: host._id, status: "active", houseRules: ["No smoking", "No parties or events"] },
      },
      { upsert: true }
    );
    if (result.upsertedCount) created += 1;
  }

  console.log(`Seed complete: ${created} new, ${samples.length - created} updated.`);
  await mongoose.disconnect();
})().catch((err) => {
  console.error(err.message);
  process.exit(1);
});
