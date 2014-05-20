var http = require('http');
var fs = require('fs');
var parser = require('url');
var mongoose = require('mongoose');
var querystring = require('querystring');
var ejs = require('ejs');

mongoose.connect('mongodb://localhost/app');
var Photo = mongoose.model('Photo', { user: String });
var Comment = mongoose.model('Comment', { user: String, content: String, photoid: String });

function saveImage(req, res) {
	var data = '';
	req.on('data', function(somedata){
		data+=somedata.toString();
	});
	req.on('end', function(){
		var parsdata = querystring.parse(data);
		var newimage = parsdata.imagedata.split(',').pop();
		var buffer = new Buffer(newimage, 'base64');
		var usrnm = localStorage.username;
		var photo = new Photo({user: usrnm});
		photo.save(function (err, result) {
			if (err){
				res.writeHead(302, {'Location': '/static/index.html'});
				res.end('\n');
				return;
			}
			console.log(result._id);
			fs.writeFileSync(__dirname + '/images/' + result._id + '.jpg', buffer, 'binary');
			res.writeHead(302, {'Location': 'feed'});
			res.end('\n');
			return;
		});
	})
}

function renderFeed(req, res){
	Photo.find({}, null).sort('-_id').exec(
		function(error, photos){
			res.writeHead(200, {'Content-Type': 'text/html'});
			var html = ejs.render(fs.readFileSync('./static/feed.html').toString(), {
				photos: photos
			})
			res.write(html);
			res.end('\n');
			return;
		}
	); 
	
}

function renderPhoto(req, res, photoid){
	var data = '';
	var renderComments = function(){
		Comment.find({photoid: photoid}, null, function(error, comments){
			res.writeHead(200, {'Content-Type': 'text/html'});
			var html = ejs.render(fs.readFileSync('./static/photo.html').toString(), {
				comments: comments, photoid: photoid
			})
			res.write(html);
			res.end('\n');
			return;
		} );
	}
	req.on('data', function(somedata){
		data+=somedata.toString();
	});
	req.on('end', function(){
		if (data){
			var parsdata = querystring.parse(data);
			if (parsdata.user.trim() && parsdata.content.trim()){
				var comment = new Comment({ user: parsdata.user, content: parsdata.content, photoid: photoid });
				comment.save(function (err, result) {
					if (err){
						res.end('\n');
						return;
					}
					renderComments();
				});
			} else {
				renderComments();
			}
		} else {
			renderComments();
		}
	})
}


http.createServer(function(req, res) {
    var url = parser.parse(req.url).pathname;
    if (url === '/feed') {
		renderFeed(req, res);
		return;
    }
	urlpic = url.split('/photo/');
	if (urlpic.length === 2) {
		renderPhoto(req, res, urlpic[1]);
		return;
    }
    if (url === '/saveimage') {
        saveImage(req, res);
		return;
    }
    if (url === '/static/main.js') {
        res.writeHead(200, {'Content-Type': 'text/javascript'});
        res.write(fs.readFileSync(__dirname + '/static/main.js'));
        res.end('\n');
		return;
    }
	if (url === '/static/feed.js') {
        res.writeHead(200, {'Content-Type': 'text/javascript'});
        res.write(fs.readFileSync(__dirname + '/static/feed.js'));
        res.end('\n');
		return;
    }
	if (url === '/static/photo.js') {
        res.writeHead(200, {'Content-Type': 'text/javascript'});
        res.write(fs.readFileSync(__dirname + '/static/photo.js'));
        res.end('\n');
		return;
    }
    if (url === '/static/main.css') {
        res.writeHead(200, {'Content-Type': 'text/css'});
        res.write(fs.readFileSync(__dirname + '/static/main.css'));
        res.end('\n');
		return;
    }
	if (url === '/static/photo.css') {
        res.writeHead(200, {'Content-Type': 'text/css'});
        res.write(fs.readFileSync(__dirname + '/static/photo.css'));
        res.end('\n');
		return;
	}
	 if (url === '/static/feed.css') {
        res.writeHead(200, {'Content-Type': 'text/css'});
        res.write(fs.readFileSync(__dirname + '/static/feed.css'));
        res.end('\n');
		return;
    }
	if (url === '/') {
        res.writeHead(200, {'Content-Type': 'text/html'});
        res.write(fs.readFileSync(__dirname + '/index.html'));
        res.end('\n');
		return;
    }
    if (url === '/static/index.html') {
        res.writeHead(200, {'Content-Type': 'text/html'});
        res.write(fs.readFileSync(__dirname + '/static/index.html'));
        res.end('\n');
		return;
    }
	if (url === '/static/images/upload.png') {
        res.writeHead(200, {'Content-Type': 'image/jpg'});
        res.write(fs.readFileSync(__dirname + '/static/images/upload.png'));
        res.end('\n');
		return;
    }
	if (url === '/static/glitch-canvas.min.js') {
        res.writeHead(200, {'Content-Type': 'text/javascript'});
        res.write(fs.readFileSync(__dirname + '/static/glitch-canvas.min.js'));
        res.end('\n');
		return;
    }
	urlsplit = url.split('/images/');
	if (urlsplit.length === 2) {
        res.writeHead(200, {'Content-Type': 'image/jpg'});
        res.write(fs.readFileSync(__dirname + '/images/' + urlsplit[1]));
        res.end('\n');
		return;
    }
	
	
	res.writeHead(404);
	res.end('\n');
}).listen(80);
