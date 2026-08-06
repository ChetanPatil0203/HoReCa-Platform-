/**
 * testCloudinary.js  —  Run: node testCloudinary.js
 */
require("dotenv").config();
const cloudinary = require("./src/config/cloudinary");
const cloudinaryService = require("./src/services/cloudinary.service");
const https = require("https");

const PASS = "✅ PASS";
const FAIL = "❌ FAIL";
function log(label, status, extra = "") {
  console.log(`${status}  ${label}${extra ? "  |  " + extra : ""}`);
}

function downloadBuffer(url) {
  return new Promise((resolve, reject) => {
    https.get(url, (res) => {
      const chunks = [];
      res.on("data", (c) => chunks.push(c));
      res.on("end", () => resolve(Buffer.concat(chunks)));
      res.on("error", reject);
    }).on("error", reject);
  });
}

async function run() {
  console.log("\n══════════════════════════════════════════");
  console.log("  HRC HUB — Cloudinary Integration Test  ");
  console.log("══════════════════════════════════════════\n");

  let testImagePublicId = null;
  let testDocPublicId   = null;

  // 1. Credentials / Ping
  try {
    const result = await cloudinary.api.ping();
    if (result && result.status === "ok") {
      log("Cloudinary credentials & ping", PASS, "cloud_name=" + process.env.CLOUDINARY_CLOUD_NAME);
    } else {
      log("Cloudinary credentials & ping", FAIL, JSON.stringify(result));
    }
  } catch (err) {
    log("Cloudinary credentials & ping", FAIL, err.message);
    process.exit(1);
  }

  // 2. Public Image Upload
  try {
    const buffer = await downloadBuffer("https://www.gstatic.com/webp/gallery3/1.png");
    const result = await cloudinaryService.uploadImage(buffer, "hrc-hub-test-image.png", "hrc-hub/test");
    testImagePublicId = result.cloudinaryPublicId;
    log("Public image upload", PASS, "publicId=" + result.cloudinaryPublicId);
    log("  deliveryType=upload", result.deliveryType === "upload" ? PASS : FAIL, result.deliveryType);
    log("  resourceType=image", result.resourceType === "image" ? PASS : FAIL, result.resourceType);
    log("  secureUrl is https", result.secureUrl && result.secureUrl.startsWith("https") ? PASS : FAIL);
  } catch (err) {
    log("Public image upload", FAIL, err.message);
  }

  // 3. getPublicImageUrl
  if (testImagePublicId) {
    try {
      const url = cloudinaryService.getPublicImageUrl(testImagePublicId, "png");
      log("getPublicImageUrl helper", url && url.startsWith("https://res.cloudinary.com") ? PASS : FAIL, (url || "").substring(0, 80));
    } catch (err) {
      log("getPublicImageUrl helper", FAIL, err.message);
    }
  }

  // 4. Authenticated Document Upload
  try {
    const fakePdfBuffer = Buffer.from("%PDF-1.4 HRC HUB test document");
    const result = await cloudinaryService.uploadDocument(fakePdfBuffer, "hrc-hub-test-doc.pdf", "hrc-hub/test", true);
    testDocPublicId = result.cloudinaryPublicId;
    log("Authenticated doc upload (raw)", PASS, "publicId=" + result.cloudinaryPublicId);
    log("  deliveryType=authenticated", result.deliveryType === "authenticated" ? PASS : FAIL, result.deliveryType);
    log("  resourceType=raw", result.resourceType === "raw" ? PASS : FAIL, result.resourceType);
  } catch (err) {
    log("Authenticated doc upload", FAIL, err.message);
  }

  // 5. getSignedDocumentUrl
  if (testDocPublicId) {
    try {
      const signedUrl = cloudinaryService.getSignedDocumentUrl({
        publicId: testDocPublicId,
        resourceType: "raw",
        deliveryType: "authenticated",
        format: "pdf",
        expiresInSeconds: 3600,
      });
      const isValid = typeof signedUrl === "string" && signedUrl.includes("cloudinary.com");
      log("getSignedDocumentUrl helper", isValid ? PASS : FAIL, (signedUrl || "").substring(0, 90));
    } catch (err) {
      log("getSignedDocumentUrl helper", FAIL, err.message);
    }
  }

  // 6. Cleanup
  if (testImagePublicId) {
    try {
      await cloudinaryService.deleteAsset(testImagePublicId, "image", "upload");
      log("Cleanup test image", PASS, "deleted " + testImagePublicId);
    } catch (err) {
      log("Cleanup test image", FAIL, err.message);
    }
  }
  if (testDocPublicId) {
    try {
      await cloudinaryService.deleteAsset(testDocPublicId, "raw", "authenticated");
      log("Cleanup test document", PASS, "deleted " + testDocPublicId);
    } catch (err) {
      log("Cleanup test document", FAIL, err.message);
    }
  }

  console.log("\n══════════════════════════════════════════");
  console.log("  Test complete. Check results above.     ");
  console.log("══════════════════════════════════════════\n");
}

run().catch((err) => { console.error("\nError:\n", err); process.exit(1); });
