import axios from 'axios';

const baseURL = 'http://tcc-api-elb-1124838076.us-east-2.elb.amazonaws.com';
const token = localStorage.getItem('@SexismResearch:token');
const api = axios.create({
  baseURL,
  headers: token ? { Authorization: `Bearer ${token}`} : {},
});

export default api;
