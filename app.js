var express = require('express');
var http = require('http');
var WS = require('ws').Server;
var fs = require('fs');

var app = express();
var server = http.createServer(app);
var ws = new WS({ server: server });

var js = fs.readFileSync('client.js');
var background = '#22112a';

function setBackground(color) {
	if (!/^#?([0-9a-f]{6}|[0-9a-f]{3})$/i.test(color))
		return false;

	if (color[0] != '#')
		color = '#' + color;

	background = color;

	ws.clients.forEach(function(client) {
		client.send(background);
	});

	return true;
}

ws.on('connection', function(wc) {
	wc.send(background);

	wc.on('message', function(bg) {
		setBackground(bg);
	});
});

app.get('/', function(req, res) {
	if (process.env.NODE_ENV == 'development')
		js = fs.readFileSync('client.js');

	res.set('Content-Type', 'text/html');
	res.send('<!doctype html><style>html{background:' + background + '}</style><script>' + js + '</script>');
});

app.get('/get', function(req, res) {
	res.json({ background: background });
});

app.all('/set', function(req, res) {
	var bg = req.param('bg');

	if (!setBackground(bg))
		return res.json(400, { error: 'bad background' });

	res.json({ message: 'background changed' });
});

server.listen(process.env.PORT || 9001);
