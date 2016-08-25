var express = require('express');

var app = express();

var port = process.env.PORT || 8000;

app.listen(port);
console.log("Listening on port: " + port);

app.use(express.static(__dirname + '/client'));
