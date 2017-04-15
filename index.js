'use strict';

//------CONSTANTS-------
var port = process.env.PORT || 8080;
var dburl = process.env.DATABASE_URL || 'postgres://zogkxovsuixudm:1090dacb708f4e496e1e07fc4b675db5bc3f41bfb5a389375c3dd26c1cf0f188@ec2-54-235-153-124.compute-1.amazonaws.com:5432/d738cir5rt92ub';

var pg = require("pg");
var express = require('express');

var app = express();
var pool = new pg.Pool(config);

var config = {
  user: process.env.PGUSER,
  database: process.env.PGDATABSE,
  password: process.env.PGPASSWORD,
  host: process.env.PGHOST,
  port: 8080, //env var: PGPORT
  max: 2, // max number of clients in the pool
  idleTimeoutMillis: 30000, // how long a client is allowed to remain idle before being closed
};


//------SITES-------
app.get('/', function (req, res) {
  res.send('Hello World!')
})


//-----FOOTERS-------
app.listen(8080, function () {
  console.log('Example app listening on port 8080!')
})