const { User, Product, Document, HorecaRegistration, VendorRegistration } = require("./src/models");

async function check() {
  console.log("--- LATEST USER PROFILE PHOTOS ---");
  const users = await User.findAll({
    limit: 5,
    order: [["updatedAt", "DESC"]],
    attributes: ["id", "firstName", "lastName", "profilePhoto", "profilePhotoPublicId", "updatedAt"]
  });
  users.forEach(u => {
    console.log(`User: ${u.firstName} ${u.lastName} (${u.id})`);
    console.log(`  Photo: ${u.profilePhoto}`);
    console.log(`  PublicId: ${u.profilePhotoPublicId}`);
    console.log(`  Updated: ${u.updatedAt}`);
  });

  console.log("\n--- LATEST PRODUCTS ---");
  const products = await Product.findAll({
    limit: 5,
    order: [["updatedAt", "DESC"]],
    attributes: ["id", "name", "imageUrl", "cloudinaryPublicId", "updatedAt"]
  });
  products.forEach(p => {
    console.log(`Product: ${p.name} (${p.id})`);
    console.log(`  Image: ${p.imageUrl}`);
    console.log(`  PublicId: ${p.cloudinaryPublicId}`);
    console.log(`  Updated: ${p.updatedAt}`);
  });

  console.log("\n--- LATEST DOCUMENTS ---");
  const docs = await Document.findAll({
    limit: 5,
    order: [["updatedAt", "DESC"]],
    attributes: ["id", "userId", "docKey", "fileUrl", "cloudinaryPublicId", "updatedAt"]
  });
  docs.forEach(d => {
    console.log(`Doc: ${d.docKey} (${d.id})`);
    console.log(`  Url: ${d.fileUrl}`);
    console.log(`  PublicId: ${d.cloudinaryPublicId}`);
    console.log(`  Updated: ${d.updatedAt}`);
  });
}

check().catch(console.error).finally(() => process.exit(0));
