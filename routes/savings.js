const express = require("express");
const router = express.Router();
const { ObjectId } = require("mongodb");
const db = require("../database/connection");

// Collection
const collection = db.collection("savings");

// Test
router.get("/", (req, res) => {
  return res.send("Hello World!");
});

// Get all of user's savings acccounts
router.get("/fetch", async (req, res) => {
  const { user_id } = req.query;

  try {
    let results = await collection.find({ owner_id: user_id }).toArray();

    if (!results.length) return res.sendStatus(404);

    return res.status(200).json(results);
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
});

// Get all transactions related to the savings' account ID
router.get("/fetchTransactions/:id", async (req, res) => {
  const account_id = req.params.id;

  let transactions = db.collection("transactions");
  let results = await transactions.find({ savings_id: account_id }).toArray();

  return res.status(200).json(results);
});

// Open/create a savings account for user
router.post("/create", async (req, res) => {
  try {
    let document = await collection.insertOne(req.body);

    if (document.insertedId) return res.sendStatus(201);
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
});

// Update a savings account via ID
router.post("/update/:id", async (req, res) => {
  const { owner_id } = req.query;
  const savings_id = req.params.id;

  const filter = {
    _id: new ObjectId(savings_id),
    owner_id: owner_id,
  };

  try {
    let document = await collection.updateOne(filter, {
      $set: req.body,
    });

    if (document.modifiedCount === 1) return res.sendStatus(200);
    if (document.matchedCount !== 1) return res.sendStatus(404);
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
});

// Delete a savings account through ID
router.delete("/delete/:id", async (req, res) => {
  const { owner_id } = req.query;
  const savings_id = req.params.id;

  try {
    let result = await collection.deleteOne({
      _id: new ObjectId(savings_id),
      owner_id: owner_id,
    });

    if (result.deletedCount === 0) return res.sendStatus(404);

    return res.sendStatus(200);
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
});

module.exports = router;
