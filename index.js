import { createWebSocketStream, WebSocket } from "ws";
import express from "express";

const app = express();
app.use(express.json());

const port = process.argv[2] || 3000;

app.post("/", (req, res) => {
  const address = req.body.address;

  console.log(`Received request with address: ${address}`);

  const results = [];
  let errorMessage = null;

  const ws = new WebSocket(address);

  ws.on("error", (error) => {
    console.log(error);
    errorMessage = error.message;
  });

  ws.on("open", () => {
    console.log("Connected to server.");
  });

  ws.on("close", () => {
    console.log("Connection closed.");

    if (errorMessage) {
      res.json({ error: errorMessage });
      return;
    } else res.json(results);
  });

  ws.on("message", (data) => {
    console.log("Received data:", data);
    results.push(data);
  });
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
