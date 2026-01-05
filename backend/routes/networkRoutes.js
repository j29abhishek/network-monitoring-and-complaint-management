const express = require("express");
const ping = require("ping");
const ipCollection = require("../db/IpCollections");
const IpStatusCollection = require("../db/IpStatusCollection");
const IpCollections = require("../db/IpCollections");

module.exports = function (io) {
  const router = express.Router();

  const timeInterval = 20000;
  const tseconds = timeInterval / 1000;

  // Save IP route
  router.post("/saveIp", async (req, res) => {
    try {
      const trimmedIp = req.body.ipAddress.trim();
      const ipEntry = new ipCollection({ ...req.body, ipAddress: trimmedIp });
      const savedData = await ipEntry.save();
      res.status(201).json({ message: "IP data saved", data: savedData });
    } catch (err) {
      if (err.code === 11000) {
        res.status(400).json({ error: "IP address already exists." });
      } else {
        res.status(500).json({ error: "Failed to save", details: err.message });
      }
    }
  });

  //Router to fetch one IP by ID (for edit form prefill)
  router.get("/saveIp/:id",async(req,res)=>{
    try{
      const ip=await IpCollections.findById(req.params.id);
      if(!ip){
        return res.status(404).json({message:"IP not found"});
      }
      res.json(ip);
    }catch(error){
      res.status(500).json({error:"Failed to fetch ip"});
    }
  })

  //Router to Edit/Update the form
  router.put("/saveIp/:id",async(req,res)=>{
    try{
      const updatedIp=await IpCollections.findByIdAndUpdate(req.params.id,req.body,{new:true});
      if(!updatedIp){
        return res.json(404).json({message:"Ip not found"});
      }
      res.json(updatedIp);
    }catch(error){
      res.status(500).json({error:"Failed to update user"});
    }
  });

  // Get IP list from ip collection
  router.get("/getIP", async (req, res) => {
    try {
      const ipList = await ipCollection.find();
      res.json(ipList);
    } catch (err) {
      res.status(500).json({ message: "Error fetching IPs" });
    }
  });

  //Router to delete ip from IP COLLECTION
  router.delete("/getIp/:id",async(req,res)=>{
    try{
      const deletedUser=await IpCollections.findByIdAndDelete(req.params.id);
      if(!deletedUser){
        return res.status(404).json({message:"User not found"});
      }
      res.json({message:"User deleted successfully."});
    }catch(error){
      res.status(500).json({error:"Failed to delete user"});
    }
  })
  //get data from IP STATUS

  router.get("/get-ip-status", async (req, res) => {
    try {
      const ipStatusData = await IpStatusCollection.find();
      res.json(ipStatusData);
    } catch (error) {
      res.status(500).json({ message: "Error fetching IPs" });
    }
  });

  // Ping IP function
  async function pingIP(ip) {
    try {
      const res = await ping.promise.probe(ip);
      const packetLoss = parseFloat(res.packetLoss.replace("%", "")) || 0;
      return {
        status: res.alive ? "up" : "down",
        packetDrops: `${packetLoss}%`,
      };
    } catch (error) {
      return {
        status: "down",
        packetDrops: "100%",
      };
    }
  }

  // Ping all IPs periodically
  setInterval(async () => {
    try {
      const ipList = await ipCollection.find(); // Get all IPs from ipCollection
      for (const ipObj of ipList) {
        const ip = ipObj.ipAddress.trim();
        const { status: currentStatus, packetDrops } = await pingIP(ip);
        const lastStatus = ipObj.currentStatus;

        let uptime = ipObj.uptime || 0;
        let downtime = ipObj.downtime || 0;

        // Update uptime and downtime
        if (currentStatus === "up") {
          uptime += tseconds;
        } else {
          downtime += tseconds;
        }

        // Update the status in ipCollection
        await ipCollection.updateOne(
          { ipAddress: ip },
          {
            $set: {
              currentStatus,
              uptime,
              downtime,
              lastUpdated: new Date(),
            },
          }
        );

        // Emit status update only when there is a status change
        if (currentStatus !== lastStatus) {
          // Log status in IpStatusCollection
          await IpStatusCollection.create({
            ipAddress: ip,
            status: currentStatus,
            packetDrops,
          });

          console.log(`🔁 Status changed: ${ip} => ${currentStatus}`);
        } else {
          console.log(`✅ No change for IP ${ip} | Status: ${currentStatus}`);
        }

        // Emit status change via Socket.IO in every t seconds.
        io.emit("status-update", {
          ip,
          status: currentStatus,
          timestamp: new Date(),
          uptime,
          downtime,
          packetDrops,
        });
      }
    } catch (err) {
      console.error("Error during pinging:", err.message);
    }
  }, timeInterval); // Ping every 20 seconds

  // Socket.IO logic
  io.on("connection", (socket) => {
    console.log("📡 Client connected for IPMAP:", socket.id);

    // Send initial status for all IPs when a client connects
    socket.on("request-initial-status", async () => {
      try {
        const ipList = await ipCollection.find(); // Fetch all IPs from ipCollection
        for (const ipObj of ipList) {
          const ip = ipObj.ipAddress.trim();

          // If no status change in IpStatusCollection, default to "up"
          const latestStatus = await IpStatusCollection.findOne({
            ipAddress: ip,
          }).sort({ timestamp: -1 });

          if (latestStatus) {
            socket.emit("status-update", {
              ip,
              status: latestStatus.status,
              timestamp: latestStatus.timestamp,
              uptime: ipObj.uptime,
              downtime: ipObj.downtime,
              packetDrops: latestStatus.packetDrops,
            });
          } else {
            // If no status exists, send a default "up" status (or whichever default you prefer)
            socket.emit("status-update", {
              ip,
              status: ipObj.currentStatus, // Default to 'up' if there's no status in IpStatusCollection
              timestamp: new Date(),
              uptime: "0",
              downtime: "0",
              packetDrops: "0%",
            });
          }
        }
      } catch (err) {
        console.log("Error sending initial status:", err.message);
      }
    });

    socket.on("disconnect", () => {
      console.log("❌ Client disconnected:", socket.id);
    });
  });

  return router;
};

/**
 * Network Monitoring System
 * Developed by Abhishek Jaiswal (Intern)
 * National Informatics Centre (NIC)
 */