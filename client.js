
var express = require('express')
var app = express();
var routes = require('./route');
var bodyParser = require('body-parser');
const logger = require('./config/winston')
const morgan = require('morgan');
// Configure bodyparser to handle post requests
app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json());


var cors = require('cors')
app.use(cors())

// // Import Mongoose
// let mongoose = require('mongoose');

// // Connect to Mongoose and set connection variable
// mongoose.connect('mongodb://localhost:27017/lockerSystem', { useNewUrlParser: true, useUnifiedTopology: true});
// var db = mongoose.connection;

// // Added check for DB connection
// if(!db)
//     console.log("Error connecting db")
// else
//     console.log("Db connected successfully")

// Send message for default URL
app.get('/', (req, res) => res.send('Hello World with Express'));
app.use('/api/v1', routes);

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // add this line to include winston logging
  logger.error(`${err.status} - ${err.message} - ${req.originalUrl} - ${req.method} - ${req.ip}`);

  // render the error page
  res.status(err.status);
  res.render('error');
});
app.use(morgan('combined', { 
  stream: logger.stream 
  }
));

const server = app.listen(3000, () => {
    console.log(`Express is running on port ${server.address().port}`);
  });

  /*
There are five classes defined by the standard:
    1xx informational response – the request was received, continuing process
    2xx successful – the request was successfully received, understood, and accepted
    3xx redirection – further action needs to be taken in order to complete the request
    4xx client error – the request contains bad syntax or cannot be fulfilled
    5xx server error – the server failed to fulfil an apparently valid request
  */


