const express = require("express");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const path = require("path");
const { verifyToken } = require("./middlewares/authMiddleware");
const app = express();

const corsOptions = {
  origin: process.env.NODE_ENV === 'production'
    ? true
    : 'http://localhost:5173',
  credentials: true,
};
app.use(cors(corsOptions));

require("dotenv").config();

// middlewares
app.use(express.json());
app.use(cookieParser());
app.use(express.urlencoded({ extended: false }));

// routes
app.use("/api", require("./routes/userRoutes"));
app.use("/api/admin", verifyToken, require("./routes/adminRoutes"));
app.use("/api/donor", require("./routes/donorRoutes"));
// add routes here using same format
// add routes here using same format
// add routes here using same format

// serve frontend build in production
if (process.env.NODE_ENV === 'production') {
  app.use(express.static(path.join(__dirname, '../client/dist')));

  app.get('*', (req, res) => {
    res.sendFile(path.resolve(__dirname, '../client/dist', 'index.html'));
  });
}

// port
const port = 5000;
app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});