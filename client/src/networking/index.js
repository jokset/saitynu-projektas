import axios from 'axios';

const header = {
    'Content-Type': 'application/json',
    'Accept': 'application/json'
};

const client = axios.create({
    baseURL: process.env.REACT_APP_API_URL,
    headers: header,
    withCredentials: true
});

export default client;