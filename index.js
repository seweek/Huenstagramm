var http = require('http');
var fs = require('fs');
var parser = require('url');
var mongoose = require('mongoose');
var querystring = require('querystring');
var ejs = require('ejs');

mongoose.connect('mongodb://localhost/app');
var Photo = mongoose.model('Photo', { user: String });

function saveImage(req, res) {
	var data = '';
	req.on('data', function(somedata){
		data+=somedata.toString();
	});
	req.on('end', function(){
		var parsdata = querystring.parse(data);
		var newimage = parsdata.imagedata.split(',').pop();
		var buffer = new Buffer(newimage, 'base64');
		var photo = new Photo({ user: 'Anonymous' });
		photo.save(function (err, result) {
			if (err){
				res.end();
				return;
			}
			console.log(result._id);
			fs.writeFileSync(__dirname + '/images/' + result._id + '.jpg', buffer, 'binary');
			res.end();
		});
	})
}

function renderFeed(req, res){
	Photo.find({}, null, function(error, photos){
		res.writeHead(200, {'Content-Type': 'text/html'});
		var html = ejs.render(fs.readFileSync('./static/feed.html').toString(), {
            photos: photos
        })
		res.write(html);
		res.end();
	} );
}


http.createServer(function(req, res) {
    var url = parser.parse(req.url).pathname;
    if (url === '/feed') {
		renderFeed(req, res);
    }
    if (url === '/saveimage') {
        saveImage(req, res);
    }
    if (url === '/static/main.js') {
        res.writeHead(200, {'Content-Type': 'text/javascript'});
        res.write(fs.readFileSync(__dirname + '/static/main.js'));
        res.end();
    }
	if (url === '/static/feed.js') {
        res.writeHead(200, {'Content-Type': 'text/javascript'});
        res.write(fs.readFileSync(__dirname + '/static/feed.js'));
        res.end();
    }
    if (url === '/static/main.css') {
        res.writeHead(200, {'Content-Type': 'text/stylesheet'});
        res.write(fs.readFileSync(__dirname + '/static/main.css'));
        res.end();
    }
	 if (url === '/static/feed.css') {
        res.writeHead(200, {'Content-Type': 'text/stylesheet'});
        res.write(fs.readFileSync(__dirname + '/static/feed.css'));
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
	url = url.split('/images/');
	if (url.length === 2) {
        res.writeHead(200, {'Content-Type': 'image/jpg'});
        res.write(fs.readFileSync(__dirname + '/images/' + url[1]));
        res.end();
    }
}).listen(80);