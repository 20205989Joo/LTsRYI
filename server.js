const express = require("express");
const cors = require("cors");
const axios = require("axios");
const cookieParser = require("cookie-parser");

const server = express();
const PORT = process.env.PORT || 3000;

server
  .use(cors({ origin: true, credentials: true }))
  .use(express.json())
  .use(cookieParser());

server.post('/api/saveResults', (req, res) => {
    console.log(req.body);
    res.status(200).json({ message: 'Results saved successfully' });
});

server.get('/api/saveResults', (req, res) => {
  res.status(200).json({ message: 'GET request to saveResults endpoint successful' });
});

server.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
