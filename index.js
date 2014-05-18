var http = require('http');
var fs = require('fs');
var parser = require('url');
var mongoose = require('mongoose');
var querystring = require('querystring');

function saveImage(req, res) {
	var data = '';
	req.on('data', function(somedata){
		data+=somedata.toString();
	});
	req.on('end', function(){
		var parsdata = querystring.parse(data);
		var newimage = parsdata.imagedata.split(',').pop();
		var buffer = new Buffer(newimage, 'base64');
		fs.writeFileSync(__dirname + '/static/img1.jpg', buffer, 'binary');
		res.end();
	})
}

http.createServer(function(req, res) {
    var url = parser.parse(req.url).pathname;
    if (url === '/feed') {
        res.send(200);
    }
    if (url === '/saveimage') {
        saveImage(req, res);
    }
    if (url === '/static/main.js') {
        res.writeHead(200, {'Content-Type': 'text/javascript'});
        res.write(fs.readFileSync(__dirname + '/static/main.js'));
        res.end();
    }
    if (url === '/static/main.css') {
        res.writeHead(200, {'Content-Type': 'text/stylesheet'});
        res.write(fs.readFileSync(__dirname + '/static/main.css'));
        res.end();
    }
    if (url === '/static/index.html') {
        res.writeHead(200, {'Content-Type': 'text/html'});
        res.write(fs.readFileSync(__dirname + '/static/index.html'));
        res.end();
    }
	if (url === '/static/glitch-canvas.min.js') {
        res.writeHead(200, {'Content-Type': 'text/javascript'});
        res.write(fs.readFileSync(__dirname + '/static/glitch-canvas.min.js'));
        res.end();
    }
	if (url === '/static/img1.jpg') {
        res.writeHead(200, {'Content-Type': 'image/jpg'});
        res.write(fs.readFileSync(__dirname + '/static/img1.jpg'));
        res.end();
    }
}).listen(80);