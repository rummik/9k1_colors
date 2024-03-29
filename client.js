console.log("Use `ws.send('#HEX')` to set the background color.");

(function connect() {
	var ws = window.ws = new WebSocket('ws://' + location.host);

	console.log('connecting');

	ws.onopen = function open() {
		console.log('connected');
	};

	ws.onmessage = function receive(message) {
		console.log('setting background to', message.data);
		document.querySelector('html').style.background = message.data;
	};

	ws.onclose = function owwy() {
		console.log('disconnected');
		console.log('reconnecting in 20 seconds');
		setTimeout(connect, 20 * 1000);
	};
})();
