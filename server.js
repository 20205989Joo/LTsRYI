const express = require("express");
const cors = require("cors");
const axios = require("axios");
const cookieParser = require("cookie-parser");

const server = express();

server
  .use(cors({ origin: true, credentials: true }))
  .use(express.json())
  .use(cookieParser());

const requestRefresh = async () => {
    const response = await axios.get(
      "https://web-ltryi-1ru12mlw3glz2u.sel5.cloudtype.app/saveResults",
      {
        withCredentials: true
      }
    );
    console.log(response);
};

server.post('/saveResults', (req, res) => {
    // POST 요청 데이터를 여기서 처리
    console.log(req.body);
    res.status(200).json({ message: 'Results saved successfully' });
});

server.get('/saveResults', (req, res) => {
  // GET 요청에 대한 처리를 여기에 추가
  res.status(200).json({ message: 'GET request to saveResults endpoint successful' });
});

server.listen(3000, () => {
    console.log('Server running on port 3000');
});

// 클라이언트에서 POST 요청 보내기
axios.post('https://web-ltryi-1ru12mlw3glz2u.sel5.cloudtype.app/saveResults', {
    // POST 요청 데이터를 여기에 추가
    data: '데이터를 여기에 추가하세요'
})
.then(response => {
    console.log(response.data);
})
.catch(error => {
    console.error('Error:', error);
});