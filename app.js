$(function () {
	"use strict";
	// for better performance - to avoid searching in DOM
	var map = $('#map');
  var bounds;
	var minlat;
	var maxlat;
	var minlng;
	var maxlng;
	google.maps.event.addListener(map, 'idle', function() {
		bounds =  map.getBounds();
		var ne = bounds.getNorthEast();
		var sw = bounds.getSouthWest();
		minlat = sw.lat();
		minlng = sw.lng();
		maxlat = ne.lat();
		maxlng = ne.lng();
 });
	// if user is running mozilla then use it's built-in WebSocket
	window.WebSocket = window.WebSocket || window.MozWebSocket;
	// if browser doesn't support WebSocket, just show
	// some notification and exit
	if (!window.WebSocket) {
	  content.html($('<p>',
		{ text:'Sorry, but your browser doesn\'t support WebSocket.'}
	  ));
	  input.hide();
	  $('span').hide();
	  return;
	}
	// open connection
	var connection = new WebSocket('ws://127.0.0.1:1337');
	connection.onopen = function () {
	 
	  
	};
	connection.onerror = function (error) {
	  // just in there were some problems with connection...
	  content.html($('<p>', {
		text: 'Sorry, but there\'s some problem with your '
		   + 'connection or the server is down.'
	  }));
	};

	$("#generate").click(function(){
		
		 //send data to server        
		 var json_msg = {
				 "type" : "command",
				 "data" : "start",
				 "min_lat" : minlat,
				 "max_lat" : maxlat,
				 "min_lng" : minlng,
				 "max_lng" : maxlng
		 };
		connection.send(JSON.stringify(json_msg));
		//send coordinates of map
	});

	$("#exterminate").click(function(){
		var json_msg = {
			"type" : "command",
			"data" : "stop"
		};
		connection.send(JSON.stringify(json_msg));
	});
	
	$("#next").click(function(){
    //generate random user location on map
    var usrLoc;
		var json_msg = {
			"type" : "command",
			"data" : "next",
			"user" : usrLoc
		};
		connection.send(JSON.stringify(json_msg));
	});
	
	connection.onmessage = function (message) {
	  // try to parse JSON message. Because we know that the server
	  // always returns JSON this should work without any problem but
	  // we should make sure that the massage is not chunked or
	  // otherwise damaged.
	  try {
			var json = JSON.parse(message.data);
	  } catch (e) {
			console.log('Invalid JSON: ', message.data);
			return;
	  }
	  // receive ID to unlock and use scooter
	  if (json.type === 'scooter') { 
		
		// receive location of closest scooter
	  } else if (json.type === 'location') { 
		// use google maps to calculate walking route to scooter location
		var sctrID = json.sID;
		//book scooter command
		var json_msg = {
			"type" : "command",
			"data" : "book",
			"uid" : usrID,
			"sid" : sctrID
		};
		connection.send(JSON.stringify(json_msg));
	  } else {
		console.log('I\'ve never seen JSON like this:', json);
	  }
	};
	/**
	 * Send message when user presses Enter key
	 */
	 /* This method is optional. If the server wasn't able to
	 * respond to the in 3 seconds then show some error message 
	 * to notify the user that something is wrong.
	 */
	setInterval(function() {
	  if (connection.readyState !== 1) {
		status.text('Error');
		input.attr('disabled', 'disabled').val(
			'Unable to communicate with the WebSocket server.');
	  }
	}, 3000);
	/**
	 * Add message to the chat window
	 */
	
  });