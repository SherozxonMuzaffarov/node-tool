// services/api.js
import axios from 'axios';

const instance = axios.create({
  baseURL: 'http://your-api-base-url/api', // replace with your actual API base URL
});

export default instance;
