var http = require('http');
var express = require('express')
var app = express();
var server = http.createServer(app);
var path = require('path');
var http = require('http');
var env = require('dotenv/config');
const nodemailer = require('nodemailer');
const xoauth2 = require('xoauth2');

var io = require('socket.io').listen(server);
server.listen(8080, function () {
  console.log("Listening on port 8080");
});

app.use("/", express.static(__dirname));

var io = require('socket.io').listen(server);
