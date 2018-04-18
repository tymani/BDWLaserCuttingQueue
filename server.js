var http = require('http');
var express = require('express')
var app = express();
var server = http.createServer(app);
var path = require('path');
var http = require('http');
var anyDB = require('any-db');
const nodemailer = require('nodemailer');
const xoauth2 = require('xoauth2');

var io = require('socket.io').listen(server);
server.listen(8080);

app.use("/", express.static(__dirname));

var conn = anyDB.createConnection('sqlite3://db/users.db');

var server = http.createServer(app);
var io = require('socket.io').listen(server);

var q = [];

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

app.post("/joinqueue", function(request, response){
  response.render('index.html', {form:true})
});

// nodemailer.createTestAccount((err, account) => {
//     // create reusable transporter object using the default SMTP transport
//     let transporter = nodemailer.createTransport({
//       service: 'gmail',
//       auth: {
//         user: 'bdwautomation@gmail.com',
//         pass: 'xxxx'
//       }
//     });
//
//     // setup email data with unicode symbols
//     let mailOptions = {
//         from: '"Brown Design Workshop" <bdwautomation@gmail.com>', // sender address
//         to: 'nicholas_faulkner@brown.edu', // list of receivers
//         subject: 'Hello ✔', // Subject line
//         text: 'Hello world?', // plain text body
//         html: '<b>Hello world?</b>' // html body
//     };
//
//     // send mail with defined transport object
//     transporter.sendMail(mailOptions, (error, info) => {
//         if (error) {
//             return console.log(error);
//         }
//
//         else{
//           console.log("Message Sent");
//         }
//
//     });
// });

io.sockets.on('connection', function(socket) {
  socket.on('join', function(userid, time, school, length, pnum, email, file, callback) {
    socket.broadcast.emit('joined', socket.name);

    socket.id = userid;
    var cred = {
      'userid': userid,
      'time': time,
      'school': school,
      'length' : length,
      'phone_number': pnum,
      'email' : email,
      'file' : file
    };

    q.unshift(cred);

    callback(q);
  });

// app.listen(8080, function(){
//   console.log("Listening on Port 8080");
// });
