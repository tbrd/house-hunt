var express = require('express');

const googleMapsClient = require('@google/maps').createClient({
  key: 'AIzaSyBNbhozbUURNFlC4F0unsfR30FrxpwU18c',
  Promise: Promise
});

const getDrivingDirections = (origin, destination) => googleMapsClient.directions({origin, destination}).asPromise();
const getGeocode = (postcode) => googleMapsClient.geocode({address: postcode, region: 'UK'}).asPromise();
const getDrivingDirectionsToRuth = postcode => getDrivingDirections(postcode, "N19 4JN");
const getDrivingDirectionsToTheField = postcode => getDrivingDirections(postcode, "M468+8X Stokenchurch");

/* GET house data. */
const house = function(req, res, next) {
  const postcode = req.query.postcode;

  const promises = [
    getGeocode,
    getDrivingDirectionsToRuth,
    getDrivingDirectionsToTheField
  ].map(method => method(postcode))

  Promise.all(promises)
    .then((results) => {
      res.setHeader('Content-Type', 'application/json');
      res.send({
        geocode: results[0],
        drivingDirectionsToRuth: results[1],
        drivingDirectionsToTheField: results[2]
      });
    })
    .catch((err) => {
      res.send(err);
    });
  
};

module.exports = house;
