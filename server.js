
//imported files
var htmlRoutes = require("./app/routing/htmlRoutes.js");
var apiRoutes = require("./app/routing/apiRoutes.js");
var friends = require('./app/data/friends.js');

//dependencies
var express = require('express');
var path = require('path');
var app = express();

//port selection
var PORT = process.env.PORT || 8080;

// Sets up the Express app to handle data parsing
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.use(express.static(path.join(__dirname, './app/public')))
//importing routes
htmlRoutes(app, path);
apiRoutes(app);

//function comparing user scores to find the closest match
module.exports.lookForFriends = function () {
	let scoreArray = [];
	let current = apiRoutes.user;

	//loops through stored friends. 
	for (let i = 0; i < friends.array.length; i++) {
		let friendScore = 0;
		if (friends.array[i].name !== current.name) {

			//loop through their scores and find the difference
			for (let j = 0; j < friends.array[i].scores.length; j++) {
				let score = friends.array[i].scores[j];
				let difference = Math.abs(score - current.scores[j])
				friendScore+=difference;
			}

			//store the scores along with the friend they correspond with
			
			let friendObj = {};
			friendObj.friend = friends.array[i];
			friendObj.score = friendScore;
			scoreArray.push(friendObj)
		}
	}

	//data sorted to find who has the lowest score
	//lowest score === best compatibility.
	scoreArray.sort(function (a,b) {
		return a.score - b.score;
	});

	//lowest score is returned.
	return scoreArray[0]
}

//setting the app to listen on the selected 
app.listen(PORT, function() {
  console.log("App listening on http://localhost:" + PORT);
});


