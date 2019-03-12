import axios from 'axios';
const ipam_client = axios.create({
  baseURL: '', // if you have one
});

// Put all interceptors on this instance
ipam_client.interceptors.response.use(r => r);

export default ipam_client;
