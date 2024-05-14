const express = require('express');
const cors = require('cors');

const app = express();

// CORS를 모든 요청에 대해 허용
app.use(cors());

// JSON 형식의 본문을 처리할 수 있게 설정
app.use(express.json());

// POST 요청 처리
app.post('/api/saveResults', function (req, res) {
    console.log("Received POST /api/saveResults");
    console.log("Request body:", req.body);
    // 성공적인 데이터 처리 응답
    res.status(200).json({ message: 'Results saved successfully', data: req.body });
});

// 서버 시작
app.listen(3000, function () {
    console.log('CORS-enabled web server listening on port 3000');
});
