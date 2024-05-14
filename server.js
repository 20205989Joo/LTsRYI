const express = require("express");
const cors = require("cors");
const cookieParser = require("cookie-parser");

const server = express();
const PORT = process.env.PORT || 3000;

server
  .use(cors({ origin: true, credentials: true }))
  .use(express.json())
  .use(cookieParser());

server.post('/api/saveResults', (req, res) => {
    console.log("POST /api/saveResults called");
    console.log("Request headers:", req.headers);
    console.log("Request body:", req.body);
    res.status(200).json({ message: 'Results saved successfully' });
});

server.get('/api/saveResults', (req, res) => {
    console.log("GET /api/saveResults called");
    res.status(200).json({ message: 'GET request to saveResults endpoint successful' });
});

server.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
