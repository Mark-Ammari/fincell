const express = require('express');
const path = require('path');
const server = express();
const PORT = process.env.PORT || 8080;

server.use(express.json());
server.use(express.urlencoded({ extended: true }))
server.set('trust proxy', 1) // trust first proxy

server.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Content-Type, Accept, Authorization");
  res.header("Access-Control-Allow-Methods", "POST, GET, HEAD, DELETE, PUT, OPTIONS");
  if ('OPTIONS' == req.method) {
    res.sendStatus(200);
  }
  else {
    next();
  }
});

const companyData = require('./routes/API/companyData');
server.use(companyData)

if (process.env.NODE_ENV === 'production') {
  server.use(express.static('/frontend/build'));
  server.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, 'frontend', 'build', 'index.html'));
  });
}

server.listen(PORT, () => console.log(`listening on port: ${PORT}`));