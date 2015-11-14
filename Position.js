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

	// return square of distance in lightyears (which is an integer number)
	this.distanceSquare = function(other) {
		return (this.x - other.x) * (this.x - other.x)
			+  (this.y - other.y) * (this.y - other.y)
			+  (this.z - other.z) * (this.z - other.z);
	}

	// return distance in lightyears
	this.distance = function(other) {
		return Math.sqrt(this.distanceSquare(other));
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
