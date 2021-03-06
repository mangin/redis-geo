var express = require('express');
var app = express();
var redis = require('redis');
var client = redis.createClient(); // var client = redis.createClient(6379, "127.0.0.1");		
client.on('error', function (err) {
    console.log('error event - ' + client.host + ':' + client.port + ' - ' + err);
});

//add a new location to the set
app.get('/geoadd', function (req, res) {
  //mylocation = {set: "locations", longitude: "-122", latitude: "37", city: "San Francisco"};
  myset = req.query.set; // "locations"
  mylongitude = req.query.longitude; // "-122"
  mylatitude = req.query.latitude; // "37"
  mycity = req.query.name; // "San Francisco"
  client.geoadd(myset, mylongitude, mylatitude, mycity);
  res.send(myset);

});

//output the geohash
app.get('/geohash', function (req, res) {
  //$ redis-cli geohash locations "San Francisco"
  myset = req.query.set; // "locations"
  mycity = req.query.city; // "San Francisco"
  client.geohash(myset, mycity, function(err, results) {
	res.send("Geohash: " + results);
	})
});

//output the geopos
app.get('/geopos', function (req, res) {
  //$ redis-cli geopos locations "San Francisco"
  myset = req.query.set; // "locations"
  mycity = req.query.city; // "San Francisco"
  client.geohash(myset, mycity, function(err, results) {
	res.send("Geopos: " + results);
	})
});

// output the distance between to cities
app.get('/geodist', function (req, res) {
  //$ redis-cli geodist locations "San Francisco" 
  myset = req.query.set; // "locations"
  mycity1 = req.query.city1; // "San Francisco"
  mycity2 = req.query.city2; // "Rome"
  client.geohash(myset, mycity1, mycity2, function(err, results) {
	res.send("Distance: " + results); 
	})
});

// output the list of locations within the radius of a latitude and longitude
app.get('/georadius', function (req, res) {
	// client.georadius('locations', 'Romeo', '-122', '32', 'mi', function(err, results) {
	client.georadius('locations', '-122', '32', '100', 'mi', function(err, results) {
	res.send("Locations: " + results);
	});
});

// output the list of locations within the radius of a member of the set
app.get('/georadiusbymember', function (req, res) {
	// client.georadiusbymember('locations', 'Romeo', '100', 'mi', function(err, results) {
	client.georadiusbymember('locations', 'Romeo', '100', 'mi', function(err, results) {
	res.send("Locations: " + results);
	});

});

// use zrange to output the list of locations within the sorted set
app.get('/zrange', function (req, res) {
	client.zrange('locations', '0', '-1', 'withscores', 'asc', function(err, results) {
	res.send("Locations: " + results);
	});
});

// remove one of the cities from the list of locations
app.get('/zrem', function (req, res) {
	myset = req.query.set; // "locations"
	mycity = req.query.name; // "San Francisco"
  	client.zrem(myset, mycity);
});

var server = app.listen(3000, function () {
  var host = server.address().address;
  var port = server.address().port;

  console.log('Example app listening at http://%s:%s', host, port);

});

client.quit();




