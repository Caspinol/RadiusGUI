const axios = require('axios');

const ipam_client = axios.create({
  baseURL: `${process.env.IPAM_API_URL}${process.env.IPAM_API_ID}`,
});

ipam_client.interceptors.request.use(
  function(config) {
    // Do something before request is sent
    //console.log(config);
    return config;
  },
  function(error) {
    // Do something with request error
    return Promise.reject(error);
  }
);
//ipam_client.interceptors.response.use(r => r);

module.exports = ipam_client;
