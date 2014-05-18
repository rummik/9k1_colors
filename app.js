var express = require('express');
var app = express();
var fs = require('fs');

var background = '#22112a';

app.get('/', function(req, res) {
	res.set('Content-Type', 'text/html');
	res.send('<!doctype html><style>html{background:' + background + '}</style><script src="js"></script>');
});

var js = fs.readFileSync('sync.js').toString('utf8');
app.get('/js', function(req, res) {
	if (process.env.NODE_ENV == 'development')
		js = fs.readFileSync('sync.js').toString('utf8');

	res.set('Content-Type', 'application/javascript');
	res.send(js);
});

app.get('/set', function(req, res) {
	var bg = req.param('bg');

	if (!/^#?([0-9a-f]{6}|[0-9a-f]{3})$/i.test(bg))
		return res.json(400, { error: 'bad background' });

	if (bg[0] != '#')
		bg = '#' + bg;

	background = bg;
	res.json({ message: 'background changed' });
});

app.listen(process.env.PORT || 9001);
