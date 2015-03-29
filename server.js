//========================================================
//================ EXPRESS PORTION =======================
//========================================================

var app = require('express')();
// var app = express();
// app.use(express.static(__dirname + '/public'));

var server = require('http').Server(app);
server.listen(4000);

app.get('/', function (req, res) {
  res.sendFile(__dirname + '/index.html');
});


//========================================================
//=============== SOCKET.IO PORTION ======================
//========================================================

var io = require('socket.io')(server);

var connectedSockets = [];


io.on('connection', function (socket){

	console.log("We have a new client: " + socket.id);

	//add it to the array of connected sockets
	connectedSockets.push(socket);

	//disconnection event
	socket.on('disconnect', function(){
		console.log("Client has disconnected");
		var indexToRemove = connectedSockets.indexOf(socket);
		connectedSockets.splice(indexToRemove, 1);
	
		console.log("Users Connected : " + connectedSockets.length);
	});
	
});

function emitMessage(object){
	io.emit(object.name, object);
	console.log("Sent "+object.name);
}

//========================================================
//================ TWITTER PORTION =======================
//========================================================

var Twitter = require('twitter');

var client = new Twitter({
	consumer_key: 'OSH9zEYe90ew8QSy0RcchedIx',
	consumer_secret: 'XIqSRziiAut6RNgkhEdskf0SFTeKpDaA4fehWaREXn7FkbsPOZ',
	access_token_key: '1319028200-zkM399rPAjx8MIn7HmMGqAYD1Ym6aNYCUUlsUrp',
	access_token_secret: '5QHtfe2T2N1hoEVJ4Cl4EsSR22OfCFVdxa8AxJ2OcpmHd'
});

client.stream('statuses/filter', {track: 'ISIS'}, function(stream) {
	stream.on('data', function(tweet) {
		// tweet is a JSON object
		// console.log(tweet);
		// console.log(tweet.user.screen_name);
				
		var tweetObject = {
			"name" : "tweet",
			"text" : tweet.text,
			"screenName" : tweet.user.screen_name
		} 

		emitMessage(tweetObject);

	});

	stream.on('error', function(error) {
		throw error;
	});
});