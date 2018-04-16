var express = require('express');
var app = express();
var path = require('path');
const nodemailer = require('nodemailer');
const xoauth2 = require('xoauth2')

var bodyParser = require('body-parser');
app.use(bodyParser.urlencoded({extended:false}));
app.use(bodyParser.json());

var engines = require('consolidate');
app.engine('html', engines.hogan); // tell Express to run .html files through Hogan
app.set('views', __dirname + '/templates'); // tell Express where to find templates, in this case the '/templates' directory
app.set('view engine', 'html'); //register .html extension as template engine so we can render .html pages


app.get('/', function(request, response){
  response.sendFile(path.join(__dirname + '/index.html'));
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



app.listen(8080, function(){
  console.log("Listening on Port 8080");
});
