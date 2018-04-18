var http = require('http');
var express = require('express')
var app = express();
var server = http.createServer(app);
var path = require('path');
const nodemailer = require('nodemailer');
const xoauth2 = require('xoauth2');

var io = require('socket.io').listen(server);
server.listen(8080);

app.use("/", express.static(__dirname));


app.get('/', function(request, response){
    console.log('- Request received:', request.method, request.url);
    response.sendFile(path.join(__dirname + '/index.html'));


});

// nodemailer.createTestAccount((err, account) => {
//     // create reusable transporter object using the default SMTP transport
//     let transporter = nodemailer.createTransport({
//       service: 'gmail',
//       auth: {
//         user: 'nmfaulkner@gmail.com',
//         pass: 'xxxxxx'
//       }
//     });
//
//     // setup email data with unicode symbols
//     let mailOptions = {
//         from: '"Nick Faulkner" <nmfaulkner@gmail.com>', // sender address
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



// app.listen(8080, function(){
//   console.log("Listening on Port 8080");
// });
