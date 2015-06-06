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
		theCanvas = "canvas" + (10*this.position.y + this.position.x);
		c = document.getElementById(theCanvas);
		cxt = c.getContext("2d");

		cxt.beginPath();
		cxt.moveTo(10,10);
		cxt.lineTo(40,40);
		cxt.moveTo(40,10);
		cxt.lineTo(10,40);
		cxt.stroke();
		cxt.closePath();
	}
}

	// global function that initializes stars[]
Star.stars_create=function(){
	// first star in one corner
	stars[0] = new Star(new Position(0, 0, 0));

	// second star in opposite corner
	stars[1] = new Star(new Position(nr_columns - 1, nr_columns - 1, nr_columns - 1));
}
