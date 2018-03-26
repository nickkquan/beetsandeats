const express = require("express");
const cors = require("cors")
const yelp = require("yelp-fusion");
const path = require("path");
const { yelp_api } = require("./config/yelp");
const client = yelp.client(yelp_api);
const app = express();
const PORT = process.env.PORT || 9001;

app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, "client")));
app.use(cors())


app.get('/yelpproxy', (req, res) => {
	console.log('req.query: ', req.query);
	const searchRequest = {
		term: req.query.term,
		'latitude': req.query.latitude,
		'longitude': req.query.longitude,
		'radius': req.query.radius
	};
	client.search(searchRequest).then(response => {
		console.log("Response ", response)
		const firstResult = response.jsonBody.businesses;
		const prettyJson = JSON.stringify(firstResult, null, 4);
		res.send(prettyJson);
	}).catch(e => {
		console.log(e);
	});
})

app.listen(PORT, () => {
	console.log("Battecruiser operational on port: ", PORT);
});
