const express = require('express');
const app = express();

app.use(express.json()); // JSON 형식의 입력을 처리할 수 있게 설정

// POST 엔드포인트 '/saveResults' 정의
app.post('/saveResults', (req, res) => {
    console.log(req.body);  // 콘솔에 요청 내용 출력
    res.status(200).send({ message: 'Data received successfully' });  // 응답 메시지 전송
});

const PORT = process.env.PORT || 3000;  // 포트 설정
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
