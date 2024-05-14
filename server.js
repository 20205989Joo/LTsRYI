const express = require("express");
const cors = require("cors");

const server = express();
const PORT = process.env.PORT || 3000;

server
  .use(cors({ origin: true, credentials: true }))
  .use(express.json());

let savedResults = []; // 데이터를 저장할 배열

server.post('/api/saveResults', (req, res) => {
    console.log("POST /api/saveResults called");
    console.log("Request headers:", req.headers);
    console.log("Request body:", req.body);

    const { resultsHtml, testCount } = req.body;
    savedResults.push({ resultsHtml, testCount });

    res.status(200).json({ message: 'Results saved successfully' });
});

server.get('/api/saveResults', (req, res) => {
    console.log("GET /api/saveResults called");
    res.status(200).json(savedResults);
});

server.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
