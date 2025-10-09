const express = require("express");
const cors = require("cors");
const path = require("path");

const app = express();

// middlewares
app.use(cors());
app.use(express.json());

// routes will be added here
app.use("/api", require("./routes/userRoutes"));

// port section
const PORT = 3000;
app.listen(PORT, () => {
  console.log(`server running on http://localhost:${PORT}`);
});