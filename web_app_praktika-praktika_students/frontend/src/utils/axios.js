import axios from 'axios';
// TODO: Import the adresse from the api app from constants
import {API_BASE_URL} from './constants';

/*
    With this instance we can make requests to the backend for every url we don't need a access token.
*/
const apiInstance = axios.create({
    // TODO: Set here the url to the api app from the backend
    baseURL: API_BASE_URL, // the address to the backend
    timeout: 5000, // timeout after 5 seconds
    headers: {
        'Content-Type': 'application/json', // type of the date that will be send
        Accept: 'application/json' // type of the data that will be recived
    }
});

export default apiInstance