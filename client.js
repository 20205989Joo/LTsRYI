const axios = require("axios");

axios.post('https://web-ltryi-1ru12mlw3glz2u.sel5.cloudtype.app/api/saveResults', {
    resultsHtml: document.getElementById('results').innerHTML,
    testCount: localStorage.getItem('testCount')
}, {
    headers: {
        'Content-Type': 'application/json'
    }
})
.then(response => {
    console.log(response.data);
    alert('Results saved successfully!');
})
.catch(error => {
    console.error('Error:', error);
    alert('Failed to save results.');
});
