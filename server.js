//Import the mongoose module for mongoDB
//var mongoose = require('mongoose');
//websocket
var webSocketServer = require('websocket').server;
var http = require('http');
var webSocketsServerPort = 1337;

//Set up default mongoose connection
//var mongoDB = 'mongodb://127.0.0.1/my_database';
//mongoose.connect(mongoDB);
// Get Mongoose to use the global promise library
//mongoose.Promise = global.Promise;
//Get the default connection
//var db = mongoose.connection;

//Bind connection to error event (to get notification of connection errors)
//db.on('error', console.error.bind(console, 'MongoDB connection error:'));

var server = http.createServer(function(request, response) {
	// Not important We're writing WebSocket server, not HTTP server
	/*
	 response.writeHeader(200, {
	 "Content-Type" : "text/html"
	 });
	 response.write('<head><meta http-equiv="refresh" content="1"></head>' + '<body>' + '<h1>Visualization client</h1><br>' + '<p>Timestamp: ' + time + '</p>' + '<p>Transmitted packets: ' + txp + '</p>' + '<p>Received packets: ' + rxp + '</p>' + '<p>Transmitted bytes: ' + txb + '</p>' + '<p>Received bytes: ' + rxb + '</p>' + '<p>Average packet size: ' + avg_pkt_size + '</p>' + '<p>Average inter-packet delay: ' + avg_pkt_delay + '</p>' + '</body>');
	 response.end();
	 */
});

server.listen(webSocketsServerPort, function() {
	console.log((new Date()) + "\nServer is listening on port " + webSocketsServerPort);
});

/**
 * WebSocket server
 */
var wsServer = new webSocketServer({
	// WebSocket server is tied to a HTTP server. WebSocket request is just
	// an enhanced HTTP request. For more info http://tools.ietf.org/html/rfc6455#page-6
	httpServer : server
});
wsServer.on('request', function(request) {
	  console.log((new Date()) + ' Connection from origin ' + request.origin + '.');
		var connection = request.accept(null, request.origin);
		console.log((new Date()) + ' Connection accepted.');
		//parse the received message
		connection.on('message', function(message) {
			var jsonrx = JSON.parse(message["utf8Data"]);
			console.log((new Date()) + ' Message received: ' + jsonrx["data"]);
			if (jsonrx["type"] == "command") {

				if (jsonrx["data"] == "start") {
					//generate positions within map area, store in database
					generateScooters(20);
					//coordinates error value "undefined"
					console.log((new Date())+ 'Coordinates: LAT '+ jsonrx["min_lat"]+'-'+jsonrx["max_lat"]+ ' LONG ' +jsonrx["min_lng"]+'-'+jsonrx["max_lng"]);

				}

				if (jsonrx["data"] == "stop") {
					//delete all entries on DB

					

				}
				if (jsonrx["data"] == "next") {
					//retrieve scooter closest to user location
					var usrLoc = jsonrx["user"];
					var sctrLoc;
					var sctrID;
					var json_msg = {
						"type" : "location",
						"sid" : sctrID,
						"sLoc" : sctrLoc
					};
					connection.send(JSON.stringify(json_msg));

					

				}
				if (jsonrx["data"] == "book") {
				//assign scooter to user account in DB and mark scooter as unavailable	

					

				}
			}
  	});
  });

function generateScooters(n) {
  //generate n scooters and add to the database at current map view
    for (i=1; i<n; i++){
  
    }
}


