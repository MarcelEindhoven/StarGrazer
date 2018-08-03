// Events that alter the state of an affected star:
// Initial: reuse Arrival
// Order ships from one of your stars = Departure
// Arrival including combat

// Each event has either been resolved at least once or not
// For resolved events the affected star has a new state: ownerID plus ships
// Events are visible to event ownerID plus ownerID of affected star
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
	this.ownerID = s.ownerID;
	// time that event occurred/will occur
	this.time = t;
	// nr of ships involved (departure or arrival)
	this.ships = ships;
	// initially event is not within anyone's event horizon
	this.activated = false;
	// restore state of star when event occurred
	this.reactivate = function() {
		// this.occurred == true
		this.star.ownerID = + this.ownerID;
		this.star.ships = + this.ships;
		console.log("Set star state " + this.star.name + " ownerID " + this.ownerID + " ships " + this.ships);
	}
	// save state of star when event occurs
	this.freeze = function() {
		this.ownerID = this.star.ownerID;
		this.ships = this.star.ships;
		console.log("Freeze event state " + this.star.name + " ownerID " + this.ownerID + " ships " + this.ships);
	}
	// event always belongs to affected star
	this.star.addEvent(this);
}

// otherwise invisible event to increase nr of ships
var GrowthEvent = function(t, s) {
	var e = new Event(t, s, "", s.production);
	e.activate = function() {
		this.activated = true;
		this.star.ships = + this.star.ships + this.star.production;
		this.freeze();
		var g = new GrowthEvent(this.time + 1, this.star);
	}
	return e;
}

// initialization, reinforcements or battle
var ArrivalEvent = function(t, s, ships, ownerID) {
	var e = new Event(t, s, "" + ships + " ships will arrive on " + s.name, ships);
	e.visibleTo[0] = ownerID;
	e.ownerID = ownerID;

	e.activate = function() {
		this.activated = true;
		if (this.time < 0) {
			// initialization
			this.star.ships = + this.ships;
			this.star.ownerID = this.ownerID;
			this.text = "Initialization";
		} else if (this.star.ownerID == this.ownerID) {
			// reinforcements, convert always to a number
			this.star.ships = + this.star.ships + this.ships;
			this.text = this.star.name + " reinforced with " + this.ships + " ships";
		} else {
			// battle
			if (this.ownerID < 1) {
				// attack by pirates
				this.visibleTo[0] = this.star.ownerID;
			} else if (this.star.ownerID > 0) {
				// battle between 2 real players
				this.visibleTo[1] = this.star.ownerID;
			}
			var initial = + this.star.ships;
			var attack = + this.ships;
			var defender = this.star.ownerID;
			while ((this.star.ships > 0) && (this.ships > 0)) {
				// first strike defender
				var loss = Math.ceil(this.star.ships/2);
				if (loss > this.ships) {
					loss = this.ships;
				}
				this.ships = + this.ships - loss;
				// revenge
				loss = Math.ceil(this.ships/2);
				if (loss > this.star.ships) {
					loss = this.star.ships;
				}
				this.star.ships = + this.star.ships - loss;
			}
			if (this.ships > 0) {
				// attacker has won
				this.star.ownerID = this.ownerID;
				this.star.ships = this.ships;
			} else {
			}
			this.text = this.star.name + " owned by " + players[defender].name
							+ "  " + initial + " ships attacked by " + attack +
							" ships from " + players[this.ownerID].name +
							" battle won by " + players[this.star.ownerID].name +
							"  " + this.star.ships + " ships remaining";
		}

		this.freeze();
	}
	return e;
}

// order to depart plus actual departure
var DepartureEvent = function(t, from, to, ships) {
	var e = new Event(t, from, "Departure ordered from " + from.name + " to " + to.name + " " + ships + " ships", ships);

	e.visibleTo[0] = from.ownerID;
	e.from = from;
	e.to = to;
	e.ships = + ships;

	e.activate = function() {
		this.activated = true;
		if ((this.star.ownerID != this.ownerID) || (this.star.ships < 1)){
			// nothing happens because ownerID star has changed
			this.text = "Departure order for " + this.star.name + " is canceled";
		}
		else {
			// ships will leave
			var d = + this.ships;
			console.log("ships ordered to leave = " + d + ", this.star.ships =", this.star.ships);
			// max nr of ships on star
			if (d > this.star.ships) {
				d = + this.star.ships;
			}
			this.text = "" + d + " ships are leaving " + this.star.name + " for " + this.to.name;
			this.star.ships = + Number(this.star.ships) - Number(d);
			var a = new ArrivalEvent(this.time + this.star.distance(this.to), this.to, d, this.ownerID);
			// to do: destroy some ships if journey is too long
		}
		this.freeze();
	}
	return e;
}
