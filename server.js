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
var laser_cutter1_time = 0;
var laser_cutter2_time = 0;

var io = require('socket.io').listen(server);
server.listen(8080, function () {
  console.log("Listening on port 8080")
});

app.use("/", express.static(__dirname));

var conn = anyDB.createConnection('sqlite3://db/users.db');

// var server = http.createServer(app);
var io = require('socket.io').listen(server);

var q = [null, null];
var ids = new Map();

var hr = (new Date()).getHours();

function sendEmail(userEmail){

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
          to: userEmail, // list of receivers
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

  socket.on("signin", function(username, email) {
    socket.emit('handshake', q);

    if (username == null || email == null) return; // Invalid parameter

    var userid = generateID();
    ids.set(userid, [username, email])

  });

  socket.on('join', function(username, length, pnum, email) { // Fired by client when it joins the queue

    var userid = null;

    for (var [k,v] of ids.entries()) {
      if (v[1] == email) {
        userid = k;
        break;
      }
    }

    if (userid == null) return; // This user is not signed in.

    var cred = {
      'username': username,
      'id' : userid,
      'cut_length' : length, // needed to change this bc .length is already a function
      'phone_number': pnum,
      "time_remaining": null,
      'email' : email
    };

    calculateTime();

    // q.unshift(cred);
    q.push(cred);

    io.sockets.emit('joined', q);

    pulltoCutter();
  });

  socket.on('delete-user', function(username) {
    removeUser(username);
    calculateTime();
    socket.emit('deleted', username, q, subtractFromHighestTime(username));
  });

  socket.on('up-next', function(userEmail){
    sendEmail(userEmail);
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
function removeUser(userid) {
  for (i = 0; i < q.length; i++) {
    var entry = q[i];
    if (entry['userid'] == userid) {
      q.splice(i, 1);
      ids.delete(userid)
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
  return id;
}

/*
  Function that 'pulls' the next person on the queue to start cutting.
  It checks if the cutter are empty and there exists a person on the queue to pull,
  so the server should call this function WHENEVER the lasercutter is potentially not occupied.

  Parameter: None

  Return type: Javascript Array, [<userid>, <Lasercutter Number>]
*/
function pulltoCutter() {
  var lc_num;
  if (q[0] == null) {
    lc_num = 0;
  }
  else if (q[1] == null) {
    lc_num = 1;
  } else {
    console.log("Lasercutters are all occupied")
    return null;
  }

  if (q.length < 3) {
    console.log("Lasercutter is empty, but no person on the queue to pull")
    return null;
  }

  var next_person = q[2];
  var userid = next_person['userid'];
  q[lc_num] = next_person;
  q.splice(2,1);

  io.sockets.emit('handshake', q) // Send the updated queue.

  setTimeout( function(uid) { // Sets timeout to function that handles lasercutter timeout
    removeUser(uid);
    pulltoCutter();
  }, next_person['cut_length']*60*1000, userid)

  return [userid, lc_num]
}

function calculateTime() {
  lasercutter_1 = 0;
  lasercutter_2 = 0;
  for var i = 0; i < q.length; i++ {
    if (i == 0){
      lasercutter_1 += q[i].cutLength;
      q[i].time_remaining = lasercutter_1;
    } else if (i == 1) {
      lasercutter_2 += q[i].cutLength;
      [i].time_remaining = lasercutter_2;
    } else {
      if(lasercutter_1 > lasercutter_2) {
        lasercutter_2 += q[i].cutLength;
        [i].time_remaining = lasercutter_2;
      }else{
        lasercutter_1 += q[i].cutLength;
        q[i].time_remaining = lasercutter_1;
      }
    }


  }
}

// function getLowestTime(){
//   if (laser_cutter1_time <= laser_cutter2_time){
//     return laser_cutter1_time;
//   }
//   else{
//     return laser_cutter2_time;
//   }
// };
//
// function addToLowestTime(user_time){
//   if (laser_cutter1_time <= laser_cutter2_time){
//     laser_cutter1_time += user_time;
//   }
//   else{
//     laser_cutter2_time += user_time;
//   }
// };
//
// function subtractFromHighestTime(username){
//   for (i = 0; i < q.length; i++) {
//     var entry = q[i];
//     if (entry['username'] == username) {
//       var user_time = entry[i].cut_length;
//     }
//   }
//
//   if (laser_cutter1_time >= laser_cutter2_time){
//     laser_cutter1_time -= user_time;
//   }
//   else{
//     laser_cutter2_time -= user_time;
//   }
//
//   return entry[i].cut_length;
// };
