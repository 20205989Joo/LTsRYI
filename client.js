const axios = require("axios");

// 클라이언트에서 POST 요청 보내기
axios.post('https://web-ltryi-1ru12mlw3glz2u.sel5.cloudtype.app/api/saveResults', {
    data: '데이터를 여기에 추가하세요'
})
.then(response => {
    console.log(response.data);
})
.catch(error => {
    console.error('Error:', error);
});
