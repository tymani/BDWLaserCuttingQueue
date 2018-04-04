var express = require('express');
var app = express();

app.get('/', function(request, response){
  response.sendFile(__dirname + '/home.html');
});



app.listen(8080, function(){
  console.log("Listening on Port 8080");
});
