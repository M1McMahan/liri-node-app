
//At the top of the liri.js file make it so you grab 
//the data from keys.js and store it into a variable to use
var keys = require("./keys.js");

///////FUNCTION DECLERATIONS////////
function getSong(song){
	var spotify = require('spotify');

	if(song == ""){
		song = "what's my age again";
	}
 
	spotify.search({ type: 'track', query: song }, function(err, data) {
	    if ( err ) {
	        console.log('Error occurred: ' + err);
	        return;
	    }
	 
	    // Do something with 'data' 
	    
	    //artist(s)
	    console.log('Artist(s):');
	    var i = 0;
	    for (var member in data.tracks.items[0].artists) {
	    	console.log(' ' + data.tracks.items[0].artists[i++].name + '\n');

		}
		
		//song name
		console.log('Song Name:\n ' + data.tracks.items[0].name + '\n');

		//preview link
		console.log('Preview Link:\n ' + data.tracks.items[0].preview_url + '\n');

		//album
		console.log('Album:\n ' + data.tracks.items[0].album.name);
	    
	});
}

function getMyTweets(){
	
	var Twitter = require('twitter');
 
	var client = new Twitter({
	  consumer_key: keys.twitterKeys.consumer_key,
	  consumer_secret: keys.twitterKeys.consumer_secret,
	  access_token_key: keys.twitterKeys.access_token_key,
	  access_token_secret: keys.twitterKeys.access_token_secret
	});
	 
	var params = {user_id: 'cantbfadid', count:20, exclude_replies: true};
	client.get('statuses/user_timeline', params, function(error, tweets, response){
	  if (!error) {
	  	for(var tweet in tweets){
	    	console.log('\nTweet:\n ' + tweets[tweet].text);
	    	console.log('Creation:\n ' + tweets[tweet].created_at);
	    }	
	  	
	  }
	});
}

function getMovie(movie){
	var request = require('request');

	if(movie == ""){
		movie = "Mr. Nobody";
	}

	request('http://www.omdbapi.com/?t='+movie+'&tomatoes=true', function (error, response, body) {

	  if (!error && response.statusCode == 200) {
	    
	    var info = JSON.parse(body);
	    console.log('Title: ' + info.Title);
	    console.log('\nYear: ' + info.Year);
	    console.log('\nIMDB Rating: ' + info.imdbRating);
	    console.log('\nCountry: ' + info.Country);
	    console.log('\nLanguage: ' + info.Language);
	    console.log('\nPlot: ' + info.Plot);
	    console.log('\nActors: ' + info.Actors);
	    console.log('\nRotten Tomatoes Rating: ' + info.tomatoRating);
	    console.log('\nRotten Tomatoes Url: ' + info.tomatoURL);

	  }

	})
}
//Make it so liri.js can take in one of the following arguments
/*
    my-tweets

    spotify-this-song

    movie-this

    do-what-it-says

 */
var argument = process.argv.slice(2);

if(argument[0] == "my-tweets"){
	console.log("\n----my-tweets----");

	getMyTweets();

}else if(argument[0] == "spotify-this-song"){
	console.log("\n----spotify-this-song----\n");

	var song = process.argv.slice(3);
	
	getSong(song);

}else if(argument[0] == "movie-this"){
	console.log("\n----movie-this----\n");

	var movie = process.argv.slice(3);

	getMovie(movie);

}else if(argument[0] == "do-what-it-says"){
	console.log("\n----do-what-it-says----\n");

	var fs = require("fs");
	var fileName = "random.txt";

	fs.exists(fileName, function(exists) {
	  if (exists) {
	    fs.stat(fileName, function(error, stats) {
	      fs.open(fileName, "r", function(error, fd) {
	        var buffer = new Buffer(stats.size);

	        fs.read(fd, buffer, 0, buffer.length, null, function(error, bytesRead, buffer) {
	          var data = buffer.toString("utf8", 0, buffer.length);

	          var command = data.split(",")[0].trim();
	          var arg = "";
	          //if an argument follows command then do this ...
	          if(data.split(",")[1]){
	          	arg = data.split(",")[1].trim();
	          }

	          console.log('command: ' + command + '\n');

	          if(command == "my-tweets"){
	          	getMyTweets();
	          }else if(command == "spotify-this-song"){
	          	getSong(arg);
	          }else if(command == "movie-this"){
	          	getMovie(arg);
	          }else{
	          	console.log('Command cannot be processed.');
	          }

	          fs.close(fd);

	        });
	      });
	    });
	  }
	});
}else{
	console.log("\nAppropriate arguments:\nmy-tweets\nspotify-this-song\nmovie-this\ndo-what-it-says\n");
}
