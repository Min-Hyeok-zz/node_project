var express = require('express');
var app = express();
var bodyParser = require("body-parser");
const session = require('express-session');
const fs = require('fs');
const ejs = require('ejs');

app.set('views',__dirname + '/views');
app.set('view engine','ejs');
app.engine('html',require('ejs').renderFile);

var server = app.listen(3000,function(){
	console.log('Express server has stated on port 3000');
});

app.use(express.static('public'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded());


var router = require('./router/router')(app,fs);