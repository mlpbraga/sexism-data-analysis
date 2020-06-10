import axios from 'axios';
// const baseUrl = 'http://localhost:3377';
const baseUrl = 'http://tcc-api-elb-1124838076.us-east-2.elb.amazonaws.com';

const api = axios.create({
  baseURL: baseUrl,
})

export default api;
