import axios from 'axios';
import { BASE_API_URL } from '@env';

const Api = axios.create({
    baseURL: BASE_API_URL,
});

export default Api;