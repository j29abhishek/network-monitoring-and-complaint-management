import React, { useEffect, useState, useRef } from "react";
import io from "socket.io-client";
import "../css/pingtesting.css";
import BackToDashboard from "../components/BackToDashboard";

const PingTesting = () => {
  const [logs, setLogs] = useState([]); // Ping test logs
  const [selectedIP, setSelectedIP] = useState(""); // User entered IP
  const socket = useRef(null);

  // Setup WebSocket connection
  useEffect(() => {
    socket.current = io("http://localhost:2001");

    socket.current.on("connect", () => {
      console.log("Connected to WebSocket server");
    });

    // Listen for ping results from backend
    socket.current.on("pingResult", (data) => {
      setLogs((prevLogs) => [...prevLogs, data]); // Append new ping result
    });

    return () => {
      socket.current.disconnect();
    };
  }, []);

  // Handle ping test submission
  const testPing = (event) => {
    event.preventDefault();
    if (selectedIP.trim()) {
      setLogs([]); // clear old logs when testing new IP
      socket.current.emit("testPing", selectedIP.trim());
    }
  };

  return (
    <div className="ping-testing-page">
      <div className="pingtest-heading">
        <div className="ping-testing-heading">
          <BackToDashboard />
          <h2>Ping Test</h2>
        </div>
        <div className="ping-testing-subtext">
          Check the reachability of any IP using Ping Test
        </div>
      </div>

      {/* Input form */}
      <div className="ping-testing-form">
        <form onSubmit={testPing}>
          <div className="input">
            <label htmlFor="ip-address">Enter IP Address</label>
            <input
              type="text"
              id="ip-address"
              placeholder="e.g. 8.8.8.8"
              value={selectedIP}
              onChange={(e) => setSelectedIP(e.target.value)}
            />
          </div>
          <div className="ping-button">
            <button type="submit" className="ping-testing">
              Test Ping
            </button>
          </div>
        </form>
      </div>

      {/* Ping test result table */}
      <div className="ping-testing-result">
        <div className="test-heading">
          <p>Ping Test Results</p>
        </div>
        <div className="ping-result-set">
          <table className="ping-result-table">
            <colgroup>
              <col className="col-serial" />
              <col className="col-ip" />
              <col className="col-status" />
              <col className="col-time" />
            </colgroup>
            <thead className="table-head">
              <tr>
                <th>S.No</th>
                <th>IP Address</th>
                <th>Status</th>
                <th>Time</th>
              </tr>
            </thead>
            <tbody>
              {logs.map((log, index) => (
                <tr key={index}>
                  <td>{index + 1}</td>
                  <td>{log.ip}</td>
                  <td className={log.status === "Link is Up" ? "ping-status-green" : "ping-status-red"}>
                    {log.status}
                  </td>

                  <td>{log.time}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default PingTesting;
