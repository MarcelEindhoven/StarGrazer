// collection of all stars
var stars   = new Array();
var Position = function(xin, yin, zin) {
	this.x = xin;
	this.y = yin;
	this.z = zin;

	this.clone = function() {
		return new Position(this.x, this.y, this.z);
	}
};


var Star = function (position) {
	this.position = position.clone();

	this.draw = function() {
		col = this.position.x;
		row = this.position.y;

		theCanvas = "canvas" + (10*col + row);
		c = document.getElementById(theCanvas);
		ctx = c.getContext("2d");

		height = this.position.z;
		size = 10 + 40 * height / nr_columns;
		ctx.font = "bold " + size + "px Arial";
		ctx.fillText("" + height, 25 - size/4, 25 + size/3);
	}
}

	// global function that initializes stars[]
Star.stars_create=function(){
	// first star in one corner
	stars[0] = new Star(new Position(0, 0, 0));
	stars[0].owner = "Jack";

	// second star in opposite corner
	stars[1] = new Star(new Position(nr_columns - 1, nr_columns - 1, nr_columns - 1));
	stars[1].owner = "Jill";
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