const express = require("express");
const cors = require("cors");
const yelp = require("yelp-fusion");
const path = require("path");
const { yelp_api } = require("./config/yelp");
const client = yelp.client(yelp_api);
const app = express();
const PORT = process.env.PORT || 9001;

app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, "client")));
app.use(cors());

function termTest(req) {
	let pattern = /food|bar/g;
	if (pattern.test(req.query.term)) {
		var term = req.query.term;
	}
}

function latitudeTest(req) {
	let pattern = /^-?([1-8]?[1-9]|[1-9]0)\.{1}\d{1,10}/;
	if (pattern.test(req.query.latitude)) {
		var latitude = req.query.latitude;
	}
	return latitude;
}

function longitudeTest(req) {
	let pattern = /^-?([1-8]?[1-9]|[1-9]0)\.{1}\d{1,10}/;
	if (pattern.test(req.query.longitude)) {
		var longitude = req.query.longitude;
	}
	return longitude;
}

function radiusTest(req) {
	let pattern = /^[0-9]{5}$/;
	if (pattern.test(req.query.radius)) {
		var radius = req.query.radius;
	}
	return radius;
}

app.get("/yelpproxy", (req, res) => {
	console.log("req.query: ", req.query);
	var term = termTest(req);
	var latitude = latitudeTest(req);
	var longitude = longitudeTest(req);
	var radius = radiusTest(req);
	const searchRequest = {
		term,
		latitude,
		longitude,
		radius
	};
	client
		.search(searchRequest)
		.then(response => {
			const firstResult = response.jsonBody.businesses;
			const prettyJson = JSON.stringify(firstResult, null, 4);
			res.send(prettyJson);
		})
		.catch(e => {
			console.log(e);
			res.json({
				message: "There was an error while finding data from Yelp."
			});
		});
});

app.listen(PORT, () => {
	console.log("Battecruiser operational on port: ", PORT);
});
