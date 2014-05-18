var http = require('http');
var fs = require('fs');
var parser = require('url');
var mongoose = require('mongoose');

function saveImage(req, res) {

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
}).listen(80);