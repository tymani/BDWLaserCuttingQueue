var http = require('http');
var express = require('express')
var app = express();
var server = http.createServer(app);
var path = require('path');
var http = require('http');
var anyDB = require('any-db');
var env = require('dotenv/config');
const nodemailer = require('nodemailer');
const xoauth2 = require('xoauth2');

var io = require('socket.io').listen(server);
server.listen(8080, function () {
  console.log("Listening on port 8080")
});

app.use("/", express.static(__dirname));

var conn = anyDB.createConnection('sqlite3://db/users.db');

// var server = http.createServer(app);
var io = require('socket.io').listen(server);

var q = [];
var ids = new Object();

var hr = (new Date()).getHours();

function sendEmail(){

  nodemailer.createTestAccount((err, account) => {
      // create reusable transporter object using the default SMTP transport
      let transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
          user: 'bdwautomation@gmail.com',
          pass: process.env.EMAIL_PASSWORD
        }
      });

      // setup email data with unicode symbols
      let mailOptions = {
          from: '"Brown Design Workshop" <bdwautomation@gmail.com>', // sender address
          to: 'nicholas_faulkner@brown.edu', // list of receivers
          subject: 'You\'re Next in Line for the Laser Cutter!', // Subject line
          text: 'You are next in line for the BDW laser cutters. Please head over to the design workshop.', // plain text body
          // html: '<img src="__dirname + public/img/bdw-logo.png">' // html body
      };

      // send mail with defined transport object
      transporter.sendMail(mailOptions, (error, info) => {
          if (error) {
              return console.log(error);
          }

          else{
            console.log("Message Sent");
          }

      });
  });

};

io.sockets.on('connection', function(socket) {

  // console.log("connection, 67");

  socket.emit('handshake', q); // Sends the newly connected client current state of the queue
  //^ can we send the userid here instead???

  socket.on('join', function(username, length, pnum, email) { // Fired by client when it joins the queue
    socket.broadcast.emit('joined', socket.name);

    socket.id = generateID();

    var cred = {
      'username': username,
      'id' : socket.id,
      'cut_length' : length, // needed to change this bc .length is already a function
      'phone_number': pnum,
      'email' : email
    };

    // q.unshift(cred);
    q.push(cred);

    io.sockets.emit('joined', q);
  });

  socket.on('delete-user', function(username) {
    removeUser(username);
    socket.emit('deleted', username, q);
  });

});

app.get('/', function(request, response){
    console.log('- Request received:', request.method, request.url);
    response.sendFile(path.join(__dirname + '/index.html'));
});

// Function that handles user signup.
// Takes Post request '.../userJoin and with parameters name, email, isbrown(0 or 1 boolean)
// Inserts the credentials to server database and notifies the user if failed.
app.post('/userJoin', function(req, res) {
  var stmt = "INSERT INTO user(name, email, isbrown) VALUES($1, $2, $3)";
  conn.query(stmt, [req.body.name, req.body.email, req.body.isbrown], function(err, res) {
    if (err) res.status(500).render("Something went wrong. Try again");
    else res.render('index.html', {form:true});
  });
});

app.get('*', function(request, response){
  response.status(404).send('<h1>Error: 404</h1>');
});

// Function Declarations
function removeUser(username) {
  for (i = 0; i < q.length; i++) {
    var entry = q[i];
    if (entry['username'] == username) {
      q.splice(i, 1);
      delete ids[userid];
      io.sockets.emit('deleted', entry['username'], q);
      return
    }
  }
  console.log("Invalid removeUser request with ID: " + userid)
}

function generateID() {
  var id = "";
  var possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";

  for (var i = 0; i < 10; i++)
    id += possible.charAt(Math.floor(Math.random() * possible.length));

  if (ids.hasOwnProperty(id)) {
    return generateID();
  }
  ids[id] = true;
  return id;
}
