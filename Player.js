// start with undefined player
var currentPlayer = -1;

// constructor
var Player = function(id) {
	this.id = id;
	// timeframe of player
	this.time = 0;
	// the time of the last order decides when a new order can be entered
	this.timeLastOrder = -111;
	// return events visible to player
	this.events = new Array();
	this.visibleEvents = function() {
		// note: some events will be activated right now
		return Star.visibleEvents(this.id, this.headquarter, this.time - 5, this.time);
	}
	this.addEvent = function(event) {
		event.star.addEvent(event);
	}
	this.increaseTime = function() {
		// new year
		this.time = this.time + 1;
		// what's new?
		// to do: check if turn is over
	}
}

// neutral player + real players
var players = new Array();
Player.playersCreate = function(number)  {
	var headquarters = Star.headquarters(number);
	players[0] = new Player(p);
	for(var p = 1; p < number + 1; p++) {
		players[p]= new Player(p);
		players[p].headquarter = headquarters[p-1];
		players[p].headquarter.setAsHeadquarter(p);
	}
}

// reset info on screen
Player.reset = function() {
	currentPlayer = -1;
}
