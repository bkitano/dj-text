'use strict';

//------CONSTANTS-------
var port = process.env.PORT || 8080;
var dburl = process.env.DATABASE_URL || 'postgres://zogkxovsuixudm:1090dacb708f4e496e1e07fc4b675db5bc3f41bfb5a389375c3dd26c1cf0f188@ec2-54-235-153-124.compute-1.amazonaws.com:5432/d738cir5rt92ub';

var pg = require("pg");
var express = require('express');
var twilio = require("twilio");
var exphbs  = require('express-handlebars');
const bodyParser = require('body-parser');
var http = require("http");
var dotenv = require('dotenv');
var time = require("time");

//------MIDDLEWEAR-------
// app.engine('handlebars', exphbs({defaultLayout: 'main'}));
// app.set('view engine', 'handlebars');

// express
var app = express();

// environment variables dotenv
dotenv.load();

// psql pool connect
var pool = new pg.Pool(config);
pg.defaults.ssl = true;

var config = {
  user: process.env.PGUSER,
  database: process.env.PGDATABASE,
  password: process.env.PGPASSWORD,
  host: process.env.PGHOST,
  port: 5432, //env var: PGPORT
  max: 2, // max number of clients in the pool
  idleTimeoutMillis: 30000, // how long a client is allowed to remain idle before being closed
};

//------SITES-------
app.get('/', function (req, res) {
  res.send('Hello World!')
})

app.get('/sms', function(req, res) {
    
    // setting the time
    var now = new time.Date();
    now.setTimezone("UTC-8");
    var receive_time = now.toString();
    
//   var twiml = new twilio.TwimlResponse();
//   twiml.message('Quinn Lewis sucks');
//   res.writeHead(200, {'Content-Type': 'text/xml'});
//   res.render('sms');
//   res.end(twiml.toString());
  var message = req.query;
  
  // connecting to the databases
  pool.connect( function(err, client, done) {
      done(err);
      if (err) {
          throw err;
      } else {
          client.query('INSERT INTO messages(to_country, to_state, to_city, from_zip, from_state, from_city, body, to_number, to_zip, from_number, time) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11);', [message.ToCountry, message.ToState, message.ToCity, message.FromZip, message.FromState, message.FromCity, message.Body, message.To, message.ToZip, message.From, receive_time], function(err, result) {
              if(err) {
                  console.log(err);
              } else {
                  client.query('SELECT * FROM messages ORDER BY message_id DESC LIMIT 1;', function(err, result) {
                      if(err) {
                          console.log(err);
                      } else {
                          console.log(result.rows[0]);
                      }
                  })
              }
          })
      }
  })
  // console.log(message);
});

app.get('/queue', function(req, res) {
    // variables to send to handlebars doc
    
    
    // connecting to the database
    pool.connect(function(err, client, done) {
        done(err);
        if (err) {
            throw err;
        } else {
            client.query('SELECT * FROM messages ORDER BY message_id DESC;', function(err, result) {
                if (err) {
                    console.log(err);
                } else {
                    res.send(result.rows[0]);
                }
            }); // end of client.query
        }
    }); // end of pool.connect
    
}); // end of /queue

//-----FOOTERS-------

app.listen(port, function () {
  console.log('Example app listening on port 8080!')
}); //end of app.listen

//------COMMENTS AND REMARKS-------
// todo: change structure of database to include date and time