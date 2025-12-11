// routes/toolsRoutes.js
const express = require("express");
const dns = require("dns");
const ping = require("ping");

module.exports = (io) => {
  const router = express.Router();

  // ---------------- DNS to IP ----------------
  router.post("/convertDNS", (req, res) => {
    const { dns: domain } = req.body;

    if (!domain) {
      return res.status(400).json({ error: "DNS (domain) is required" });
    }

    dns.lookup(domain, { all: true }, (error, addresses) => {
      if (error) {
        console.error("DNS lookup error:", error);
        return res.status(500).json({ error: error.message });
      }

      const ipv4 = addresses
        .filter((addr) => addr.family === 4)
        .map((addr) => addr.address);
      const ipv6 = addresses
        .filter((addr) => addr.family === 6)
        .map((addr) => addr.address);

      res.json({ ipv4, ipv6 });
      console.log(`Resolved IPs for ${domain}:`, addresses);
    });
  });

  // ---------------- Ping Testing (Socket.IO) ----------------
  io.on("connection", (socket) => {
    console.log("Client connected:", socket.id);

    let interval;

    socket.on("testPing", async (ip) => {
      if (!ip) return;

      console.log(`Pinging IP: ${ip} every 5 seconds`);

      if (interval) clearInterval(interval); // clear old test

      interval = setInterval(async () => {
        const res = await ping.promise.probe(ip);
        const status = res.alive ? "Link is Up" : "Link is Down";
        const timestamp = new Date().toLocaleString();

        console.log(
          `Ping result - IP: ${ip}, Time: ${timestamp}, Status: ${status}`
        );
        socket.emit("pingResult", { ip, time: timestamp, status });
      }, 5000); // Ping every 5s
    });

    socket.on("disconnect", () => {
      console.log("Client disconnected:", socket.id);
      if (interval) clearInterval(interval);
    });
  });

  return router;
};
