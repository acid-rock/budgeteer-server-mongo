const express = require("express");
const router = express.Router();
const db = require("../database/connection");
const { ObjectId } = require("mongodb");

// Test
router.get("/", (req, res) => {
  return res.send("Hello World!");
});

// Get all user's transaction records from database
router.get("/fetch", async (req, res) => {
  const { user_id } = req.query;

  try {
    let collection = await db.collection("transactions");
    let results = await collection.find({ user_id: user_id }).toArray();

    // Return 404 if empty.
    if (!results) return res.sendStatus(404);

    return res.status(200).json(results);
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
});

// Get a user's transaction via ID search
router.get("/fetch/:id", async (req, res) => {
  const { user_id } = req.query;
  const doc_id = req.params.id;

  try {
    let collection = await db.collection("transactions");
    let result = await collection.findOne({
      user_id: user_id,
      _id: new ObjectId(doc_id),
    });

    if (!result) return res.sendStatus(404);

    return res.status(200).json(result);
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
});

// Create a transaction
router.post("/create", async (req, res) => {
  try {
    let collection = await db.collection("transactions");
    let document = await collection.insertOne(req.body);

    if (document.acknowledged) return res.sendStatus(201);
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
});

// Update a transaction through ID search
router.post("/update/:id", async (req, res) => {
  const { user_id } = req.query;
  const doc_id = req.params.id;

  const filter = {
    _id: new ObjectId(doc_id),
    user_id: user_id,
  };

  try {
    let collection = await db.collection("transactions");
    let document = await collection.updateOne(filter, {
      $set: req.body,
    });

    if (document.acknowledged) return res.sendStatus(200);
    if (document.matchedCount !== 1) return res.sendStatus(404);
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
});

// Delete a transaction via ID search
router.delete("/delete/:id", async (req, res) => {
  const { user_id } = req.query;
  const doc_id = req.params.id;

  try {
    let collection = await db.collection("transactions");
    let result = await collection.deleteOne({
      _id: new ObjectId(doc_id),
      user_id: user_id,
    });

    console.log(result);

    if (result.deletedCount === 0) return res.sendStatus(404);

    return res.sendStatus(200);
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
});

module.exports = router;
