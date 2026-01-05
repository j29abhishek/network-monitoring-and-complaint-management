/**
 * Network Monitoring System
 * Developed by Abhishek Jaiswal (Intern)
 * National Informatics Centre (NIC)
 */
require("dotenv").config();
const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const http = require("http");
const { Server } = require("socket.io");

mongoose.connect("mongodb://localhost:27017/NIC-PROJECT-FINAL");

const app = express();
const port = process.env.PORT || 2001;

const server = http.createServer(app); // Use main app here
const io = new Server(server, {
  cors: {
    origin: "http://localhost:5173",
    methods: ["GET", "POST"],
  },
});

const authRoutes = require("./routes/authRoutes");
const formRoutes = require("./routes/formRoutes");
const networkRoutes = require("./routes/networkRoutes")(io); // Pass io to routes
const dataRoutes = require('./routes/dataRoutes')(io); // pass io instance
const toolsRoutes=require('./routes/toolsRoutes')(io);
const notificationRoutes=require('./routes/notificationRoutes');

app.use(cors());
app.use(express.json());
app.use("/", authRoutes);
app.use("/", formRoutes);
app.use("/", networkRoutes);
app.use("/",dataRoutes)
app.use("/",toolsRoutes);
app.use("/",notificationRoutes);

server.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});
