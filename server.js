const express = require('express');
const path = require('path');
const mongoose = require('mongoose');
const session = require('express-session')
const MongoStore = require('connect-mongo');
const server = express();
const PORT = process.env.PORT || 80;
// const uri = "mongodb+srv://fincell:KsJKofqe7Y9njLoe@fincell.dqw5e.mongodb.net/fincell?retryWrites=true&w=majority";

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

// server.use(session({
//   secret: process.env.NODE_ENV === "production" ? process.env.SESSION_SECRET : 'keyboard cat',
//   resave: false,
//   saveUninitialized: false,
//   store: MongoStore.create({
//     mongoUrl: uri
//   }),
//   cookie: {
//   secure: process.env.NODE_ENV === "production" ? true : false,
//   sameSite: "none",
//   maxAge: 1000 * 24 * 24 * 60,
// }
// }))


// mongoose.connect(uri || process.env.MONGODB_URI,
//   {
//     useNewUrlParser: true,
//     useUnifiedTopology: true,
//     useCreateIndex: true,
//     useFindAndModify: false
//   })
//   .then(() => console.log("MongoDB Connected"))
//   .catch((err) => console.log(err));

if (process.env.NODE_ENV === 'production') {
  server.use(express.static('frontend/build'));
  server.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, 'frontend', 'build', 'index.html'));
  });
}

server.listen(PORT, () => console.log(`listening on port: ${PORT}`));