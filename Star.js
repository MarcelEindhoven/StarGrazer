// collection of all stars
var stars = new Array();
var names = [
	"Aldran",
	"Beor",
	"Castor",
	"Diran",
	"Echo"
];

// make text fixed length
var pad = function(text, length) {
	var t = text;
	while (t.length < length) {
		t = t + " ";
	}
	return t;
}

var Star = function (position) {
	this.position = position.clone();
	// events array is always sorted on time
	this.events = new Array();
	// add event and sort on time
	this.addEvent = function(e) {
		console.log("Event added " + e.text);
		this.events.push(e);
		// events array is always sorted on time
		this.events.sort(function(a, b) {return a.time - b.time;});
	}
	// current player may move forward in time
	// activate events up to time visible from headquarter, 
	// return visible events
	this.visibleEvents = function(player, headquarter, previous, current) {
		// determine time of star as seen from headquarter
		var event_horizon = current - this.distance(headquarter);
		console.log("The following events are visible for " + this.name + " up to time " + event_horizon);
		// to do: keep future events up to date with pirate events
		// future events that become visible take place now
		this.events.filter(function(event) {
			return ((event.time < event_horizon) && (!event.activated));
		}).forEach(function(event) {
			event.activate();
		})

		var requested_start_time = previous - this.distance(headquarter);
		// set state of star to latest event within event horizon
		// and return events within event horizon
		return this.events.filter(function(event) {
			//restore state of star stored in event if event within event horizon
			if (event.time < event_horizon) {
				event.reactivate();
			}
			// if event is not initial and within event horizon and 
			// within requested period and visible to current player
			console.log("Event time " + event.time + " ownerID " + event.ownerID + " ships " + event.ships + " " + event.text);
			return ((event.time >= 0) 
				&& (event.time >= requested_start_time)
				&& (event.time < event_horizon) 
				&& event.visibleTo.reduce(function(visible, ownerID) {
					return visible || (ownerID == headquarter.ownerID);
				}, false));
		});
	}

	this.distance = function(s) {
		return this.position.distance(s.position);
	}

	this.distanceSquare = function(s) {
		return this.position.distanceSquare(s.position);
	}

	// draw info in the canvas depending on what player may see
	this.draw = function(current_player) {
		// identify canvas to draw star in
		col = this.position.x;
		row = this.position.y;

		theCanvas = "canvas" + (10*col + row);
		canvas = document.getElementById(theCanvas);
		context = canvas.getContext("2d");

		// owned stars have a green background
		if (this.ownerID == current_player) {
			context.fillStyle="#00FF00";
		} else {
			context.fillStyle="#FFFFFF";
		}
		context.fillRect(0, 0, canvas.width, canvas.height); 

		// 3D effect by setting font size
		height = this.position.z;
		size = 10 + 30 * height / nr_columns;
		context.font = "bold " + size + "px Arial";
		// black text
		context.fillStyle="#000000";
		// always start with first letter of star, which is unique
		var top = "" + this.name.charAt(0);
		// add secret info
		if (current_player == this.ownerID) {
			top = top + this.production;
		}
		context.fillText(top, 25 - size/2, 25 - size/40);
		// add additional secret info in next line
		if (current_player == this.ownerID) {
			context.fillText("" + this.ships, 25 - size/4, 25 + size*0.8);
		}
	}

	// give	status of star as a string from point of view current player
	this.status = function(center, current_player) {
		// name
		var status = pad(this.name, Star.maxNameLength + 1);
		// distance
		status = status + pad(Position.distanceToText(this.position.distance(center.position)), 6);
		// growth
		if (this.ownerID == current_player) {
			status = status + this.production;
			status = status + " " + this.ships;
		}
		return status;
	}

	// player id has chosen the following headquarter
	this.setAsHeadquarter = function(id) {
		// production for headquarter
		this.production = 5;
		// initial fleet for real player
		// events with negative time are invisible
		var e = new ArrivalEvent(-0.00001, this, 15, id);
	}

	// return sorted list of nearest stars up to 3 lightyears
	this.nearestStars = function() {
		// use integer calculations only
		var mapped = stars.map(function(star, i) {
			return { index: i, value: this.distanceSquare( star ) };
		}, this).filter(function(el) {
			return el.value <= 9;
		});
		mapped.sort(function(a, b) {
			return a.value - b.value;
		});
		return mapped.map(function(el) {
			return stars[el.index];
		});
	}

	// set state of star to current player
	this.setPlayer = function(player) {
	}
}

// length of biggest star name
Star.maxNameLength = 7;

	// global function that initializes stars[]
Star.starsCreate = function(){
	// first star in one corner
	stars[0] = new Star(new Position(0, 0, 0));

	// second star in opposite corner
	stars[1] = new Star(new Position(nr_columns - 1, nr_columns - 1, nr_columns - 1));

	// third star neutral
	stars[2] = new Star(new Position(1, 1, 1));

	for(var s = 0;s < stars.length; s++) {
		stars[s].name = names[s];
		stars[s].ownerID = -2;
		stars[s].ships = 0;
		stars[s].production = 2;
		// all stars for now start neutral
		// events with negative time are invisible
		var e = new ArrivalEvent (-0.01, stars[s], 5, 0);
		// first growth in year 1
		e = new GrowthEvent(0.99999, stars[s]);
	}
}

// return set of stars fit for headquarter
Star.headquarters = function(number) {
	var headquarters = new Array();
	for(var s=0; s < number; s++) {
		headquarters[s] = stars[s];
	}
	return headquarters;
}

// return undefined or the star at the input position
Star.getStar = function(canvasNumber) {
	var ret;

	icol = canvasNumber % 10;
	irow = (canvasNumber - icol)/10;

	for(var s = 0;s < stars.length; s++) {
		col = stars[s].position.x;
		row = stars[s].position.y;
		if ((row == irow) && (col == icol)) {
			ret = stars[s];
		}
	}

	return ret;
}

// return the star given the name of the star
Star.getStarByName = function(name) {
	return stars.filter(function(star) {
		return (name == star.name);
	})[0];
}

// set status star visible to player
// draw stars with info known to current player
Star.setCurrentPlayer = function(current_player) {
	for(var s = 0;s < stars.length; s++) {
		if (current_player > 0) {
			stars[s].setPlayer(players[current_player]);
		}
		// set status of star as seen from player
		stars[s].draw(current_player);
	}
}

// activate events up to time visible from headquarter, return visible events
Star.visibleEvents = function(player, headquarter, previous, current) {
	var visible_events = new Array();
	for(var s = 0;s < stars.length; s++) {
		visible_events = visible_events.concat(stars[s].visibleEvents(player, headquarter, previous, current));
	}
	console.log("Star returns " + visible_events.length + " visible events");
	return visible_events;
}

// return list of stars controlled by a specific player
Star.controlledStars = function(playerID) {
	return stars.filter(function(star) {
		return playerID == star.ownerID;
	});
}

