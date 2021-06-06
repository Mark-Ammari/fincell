import axios from 'axios';

const URI = "http://localhost:3000/api/v1/company-data";

const baseURI = axios.create({
    baseURL: URI
})

export default baseURI