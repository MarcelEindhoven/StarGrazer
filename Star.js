// collection of all stars
var stars   = new Array();
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

// 3D position
var Position = function(xin, yin, zin) {
	this.x = xin;
	this.y = yin;
	this.z = zin;

	this.clone = function() {
		return new Position(this.x, this.y, this.z);
	}

	// return distance in lightyears
	this.distance = function(other) {
		return Math.sqrt(Math.pow(this.x - other.x,2) + Math.pow(this.y - other.y,2) + Math.pow(this.z - other.z,2));
	}
};

Position.distanceToText = function(distance) {
	console.log(distance);
	var months = Math.round(distance * 12);
	var years = Math.floor(months / 12);
	months = months - years * 12;
	var text = "";
	if (years > 0) {
		text = text + years + "y";
		if (months > 0) {
			text = text + months + "m";
		}
	} else {
		text = "----";
	}
	return text;
}

var Star = function (position) {
	this.position = position.clone();

	this.draw = function() {
		col = this.position.x;
		row = this.position.y;

		theCanvas = "canvas" + (10*col + row);
		canvas = document.getElementById(theCanvas);
		context = canvas.getContext("2d");
		//context.clearRect(0, 0, canvas.width, canvas.height);
		if (this.owner == currentPlayer) {
			context.fillStyle="#00FF00";
		} else {
			context.fillStyle="#FFFFFF";
		}
		context.fillRect(0, 0, canvas.width, canvas.height); 

		height = this.position.z;
		size = 10 + 30 * height / nr_columns;
		context.font = "bold " + size + "px Arial";
		context.fillStyle="#000000";
		var top = "" + this.name.charAt(0);
		if (currentPlayer == this.owner) {
			top = top + this.production;
		}
		context.fillText(top, 25 - size/2, 25 - size/40);
		if (currentPlayer == this.owner) {
			context.fillText("" + this.currentShips, 25 - size/4, 25 + size*0.8);
		}
	}
	// give status of star as a string from point of view current player
	this.status = function(center) {
		// name
		var status = pad(this.name, Star.maxNameLength + 1);
		// distance
		status = status + pad(Position.distanceToText(this.position.distance(center.position)), 6);
		// growth
		if (this.owner == currentPlayer) {
			status = status + this.production;
			status = status + " " + this.currentShips;
		}
		return status;
	}

}

// length of biggest star name
Star.maxNameLength = 7;

	// global function that initializes stars[]
Star.stars_create=function(){
	// first star in one corner
	stars[0] = new Star(new Position(0, 0, 0));

	// second star in opposite corner
	stars[1] = new Star(new Position(nr_columns - 1, nr_columns - 1, nr_columns - 1));

	// third star neutral
	stars[2] = new Star(new Position(1, 1, 1));

	for(var s = 0;s < stars.length; s++) {
		stars[s].name = names[s];
		stars[s].owner = 0;
		stars[s].currentShips = 5;
		stars[s].production = 2;
	}
}

Star.set_players=function(n_players){
	for(var p = 1; p < n_players; p++) {
		stars[p-1].owner = p;
		stars[p-1].currentShips = 15;
		stars[p-1].production = 5;
	}
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

Star.setCurrentPlayer = function() {
	console.log("setCurrentPlayer " + currentPlayer);
	for(var s = 0;s < stars.length; s++) {
		stars[s].draw();
	}
}

Star.nearestStars = function(center) {
	var nearest = new Array();
	// first put all stars in output array
	for(var s = 0;s < stars.length; s++) {
		nearest[s] = stars[s];
	}
	// now sort
	return nearest;
}

