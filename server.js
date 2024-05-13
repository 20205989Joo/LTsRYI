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

server.listen(3000, () => {
    console.log('Server running on port 3000');
});
