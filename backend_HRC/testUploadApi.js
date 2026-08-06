const axios = require("c:\\HRCHUB\\mobile-app\\node_modules\\axios");
const jwt = require("jsonwebtoken");
const { User } = require("./src/models");
require("dotenv").config();

async function run() {
  console.log("Fetching user from database...");
  const user = await User.findOne();
  if (!user) {
    console.error("No user found in database!");
    process.exit(1);
  }
  console.log(`Found user: ${user.firstName} ${user.lastName} (${user.id}), role: ${user.role}`);

  const token = jwt.sign(
    { id: user.id, email: user.email, role: user.role },
    process.env.JWT_SECRET || "hrchub_jwt_secret_key_12345",
    { expiresIn: "1h" }
  );
  console.log("Generated JWT Token:", token);

  const FormData = require("c:\\HRCHUB\\mobile-app\\node_modules\\form-data");
  const form = new FormData();
  form.append("docKey", "profile_photo");
  form.append("docName", "test_avatar.png");
  // 1x1 transparent PNG buffer
  const buffer = Buffer.from("iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mNkYAAAAAYAAjCB0C8AAAAASUVORK5CYII=", "base64");
  form.append("file", buffer, { filename: "test_avatar.png", contentType: "image/png" });

  console.log("Sending POST request to /api/auth/upload-document...");
  try {
    const response = await axios.post("http://localhost:5000/api/auth/upload-document", form, {
      headers: {
        ...form.getHeaders(),
        Authorization: `Bearer ${token}`
      }
    });
    console.log("Upload response status:", response.status);
    console.log("Upload response data:", JSON.stringify(response.data, null, 2));
  } catch (err) {
    console.error("Upload failed!");
    if (err.response) {
      console.error("Status:", err.response.status);
      console.error("Data:", err.response.data);
    } else {
      console.error("Error message:", err.message);
    }
  }
}

run().catch(console.error).finally(() => process.exit(0));
