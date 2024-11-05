const { MongoClient } = require("mongodb");

const URI = process.env.ATLAS_URI || "";
const client = new MongoClient(URI);

async function run() {
  try {
    // Connect the client to server
    await client.connect();

    // Ping to confirm connection
    await client.db("admin").command({ ping: 1 });
    console.log("Ping success. MongoDB connection, success.");
  } catch (err) {
    console.error(err);
  }
}

run();

let db = client.db("budgeteer");
module.exports = db;
