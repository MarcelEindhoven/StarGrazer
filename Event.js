// Events that alter the state of an affected star:
// Initial: reuse Arrival
// Order ships from one of your stars = Departure
// Arrival including combat

// Each event has either been resolved at least once or not
// For resolved events the affected star has a new state: owner plus ships
// Events are visible to event owner plus owner of affected star
// Events are assigned to the affected star

// constructor with common elements
var Event = function(t, s, txt, ships) {
	// text to display to user
	this.text = txt;
	// players that can view this event
	this.visibleTo = new Array();
	// star altered by event
	this.star = s;
	// events can only be created for stars owned by current players
	this.owner = s.owner;
	// time that event occurred/will occur
	this.time = t;
	// nr of ships involved (departure or arrival)
	this.ships = ships;
	// initially event is not within anyone's event horizon
	this.activated = false;
	// restore state of star when event occurred
	this.reactivate = function() {
		// this.occurred == true
		this.star.owner = this.owner;
		this.star.ships = this.ships;
	}
	// save state of star when event occurs
	this.freeze = function() {
		this.owner = this.star.owner;
		this.ships = this.star.ships;
		console.log("Set event state " + this.star.name + " owner " + this.owner + " ships " + this.ships);
	}
	// event always belongs to affected star
	this.star.addEvent(this);
}

// otherwise invisible event to increase nr of ships
var GrowthEvent = function(t, s) {
	var e = new Event(t, s, "", s.production);
	e.activate = function() {
		this.activated = true;
		this.star.ships = this.star.ships + this.star.production;
		this.freeze();
		var g = new GrowthEvent(this.time + 1, this.star);
	}
	return e;
}

// initialization, reinforcements or battle
var ArrivalEvent = function(t, s, ships, owner) {
	var e = new Event(t, s, "" + ships + " ships will arrive on " + s.name, ships);
	e.visibleTo[0] = owner;
	e.owner = owner;

	e.activate = function() {
		this.activated = true;
		if (this.time < 0) {
			// initialization
			this.star.ships = this.ships;
			this.star.owner = this.owner;
			this.text = "Initialization";
		} else if (this.star.owner == this.owner) {
			// reinforcements
			this.star.ships = this.star.ships + this.ships;
			this.text = this.star.name + " reinforced with " + this.ships + " ships";
		} else {
			// battle
			if (this.owner < 1) {
				// attack by pirates
				this.visibleTo[0] = this.star.owner;
			} else if (this.star.owner > 0) {
				// battle between 2 real players
				this.visibleTo[1] = this.star.owner;
			}
			var initial = this.star.ships;
			var attack = this.ships;
			while ((this.star.ships > 0) && (this.ships > 0)) {
				// first strike defender
				var loss = Math.ceil(this.star.ships/2);
				if (loss > this.ships) {
					loss = this.ships;
				}
				this.ships = this.ships - loss;
				// revenge
				loss = Math.ceil(this.ships/2);
				if (loss > this.star.ships) {
					loss = this.star.ships;
				}
				this.star.ships = this.star.ships - loss;
			}
			if (this.ships > 0) {
				// attacker has won
				this.star.owner = this.owner;
				this.star.ships = this.ships;
			} else {
			}
			this.text = this.star.name + " " + initial + " ships attacked by " + attack +" battle won by " + this.star.owner + "  " + (initial + attack - this.star.ships) + " ships remaining";
		}

		this.freeze();
	}
	return e;
}

// order to depart plus actual departure
var DepartureEvent = function(t, from, to, ships) {
	var e = new Event(t, from, "Departure ordered from " + from.name + " to " + to.name + " " + ships + " ships", ships);
	console.log("text " + e.text);

	e.visibleTo[0] = from.owner;
	e.from = from;
	e.to = to;
	e.ships = ships;

	e.activate = function() {
		this.activated = true;
		if ((this.star.owner != this.owner) || (this.star.ships < 1)){
			// nothing happens because owner star has changed
			this.text = "Departure order for " + this.star.name + " is canceled";
		}
		else {
			// ships will leave
			var d = this.ships;
			// max nr of ships on star
			if (d > this.star.ships) {
				d = this.star.ships;
			}
			this.text = "" + d + " ships are leaving " + this.star.name + " for " + this.to.name;
			this.star.ships = this.star.ships - d;
			var a = new ArrivalEvent(this.time + this.star.distance(this.to), this.to, d, this.owner);
			// to do: destroy some ships if journey is too long
		}
		this.freeze();
	}
	return e;
}
