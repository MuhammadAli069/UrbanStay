// Creates (or promotes) an admin account.
// Usage: npm run create-admin -- admin@example.com "StrongPassword" "Admin Name"
require("dotenv").config();
const mongoose = require("mongoose");
const User = require("../models/User");

const [email, password, name = "Admin"] = process.argv.slice(2);

if (!email || !password) {
  console.error('Usage: npm run create-admin -- <email> <password> ["Name"]');
  process.exit(1);
}

(async () => {
  await mongoose.connect(process.env.MONGO_URI);

  let user = await User.findOne({ email: email.toLowerCase() });
  if (user) {
    user.role = "admin";
    user.password = password;
    await user.save();
    console.log(`Updated ${email} to admin.`);
  } else {
    await User.create({ name, email, password, role: "admin" });
    console.log(`Created admin ${email}.`);
  }

  await mongoose.disconnect();
})().catch((err) => {
  console.error(err.message);
  process.exit(1);
});
