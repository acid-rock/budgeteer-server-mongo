require("dotenv").config();

const express = require("express");
const cors = require("cors");
const transactionRoutes = require("./routes/transaction");
const savingsRoutes = require("./routes/savings");

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());
app.use("/transactions", transactionRoutes);
app.use("/savings", savingsRoutes);

app.listen(PORT, () => console.log(`Listening on port ${PORT}`));
