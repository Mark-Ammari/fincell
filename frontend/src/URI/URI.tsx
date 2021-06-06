import axios from 'axios';

const URI = process.env.NODE_ENV === "production" ? "https://fincell.herokuapp.com/api/v1/company-data" : "http://localhost:3000/api/v1/company-data";

const baseURI = axios.create({
    baseURL: URI
})

export default baseURI