const express = require('express');
const config = require('../config/keys')

const server = express();

function searchQuery(req, res, next) {
    res.header("x-api-key", config.SEARCH_API_KEY);
    next()
}

module.exports = searchQuery;