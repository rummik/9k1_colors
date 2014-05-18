var express = require('express');
var http = require('http');
var WS = require('ws').Server;
var fs = require('fs');

var app = express();
var server = http.createServer(app);
var ws = new WS({ server: server });

var js = fs.readFileSync('client.js');
var background = '#22112a';
var sanity = /^#?([0-9a-f]{6}|[0-9a-f]{3})$/i;

ws.on('connection', function(wc) {
	wc.send(background);

	wc.on('message', function(bg) {
		if (!sanity.test(bg))
			return;

		background = bg;

		ws.clients.forEach(function(client) {
			client.send(background);
		});
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

	if (!sanity.test(bg))
		return res.json(400, { error: 'bad background' });

	if (bg[0] != '#')
		bg = '#' + bg;

	background = bg;
	res.json({ message: 'background changed' });

	ws.clients.forEach(function(client) {
		client.send(background);
	});
});

server.listen(process.env.PORT || 9001);
