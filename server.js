var http = require('http');
var express = require('express')
var app = express();
var server = http.createServer(app);
var path = require('path');
var http = require('http');
var env = require('dotenv/config');
const nodemailer = require('nodemailer');
const xoauth2 = require('xoauth2');

var engines = require('consolidate');
app.engine('html', engines.hogan); // tell Express to run .html files through Hogan
app.set('views', __dirname + '/templates'); // tell Express where to find templates, in this case the '/templates' directory
app.set('view engine', 'html'); //register .html extension as template engine so we can render .html pages

var bodyParser = require('body-parser');
app.use(bodyParser.urlencoded({extended:false}));
app.use(bodyParser.json());

var io = require('socket.io').listen(server);
server.listen(8080, function () {
  console.log("Listening on port 8080");
});

app.use("/", express.static(__dirname));

var io = require('socket.io').listen(server);
//must make get for recieving time, or sockets must update time variable
//timer
//lasercutter
  //lasercutter_1_block
    //laercutter_1_name
  //lasercutter_2_block
    //lasercutter_2_name
//queue_status [no one in line, not open/hours]
//queue
  //queue_elem_selected
    //queue_num
    //queue_name
    //queue_time

app.get('/', function(request, response){
	console.log('- Request received:', request.method, request.url);
  // do any work you need to do, then
  response.render('index.html', {});
});
