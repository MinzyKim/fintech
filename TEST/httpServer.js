var http = require("http");

http.createServer(function (req, res) {
	var body = "hello Server";
	res.setHeader('Content-Type', 'text/plain; charset=utf-8');
	res.end("<html><h1>hello Server</h1></html>")
}).listen(3000);
