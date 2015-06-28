// start with undefined player
var currentPlayer = -1;

// constructor
var Player = function(id) {
	this.id = id;
	// timeframe of player
	this.time = 0;
	// the time of the last order decides when a new order can be entered
	this.timeLastOrder = -111;
}

// neutral player + real players
var players = new Array();
Player.players_create = function(number)  {
	for(var p = 0; p < number + 1; p++) {
		players[p]= new Player(p);
	}
}

// reset info on screen
Player.reset = function() {
	currentPlayer = -1;
}