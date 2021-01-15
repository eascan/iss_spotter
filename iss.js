// most of the logic for fetching data from each API

/**
 * Makes a single API request to retrieve the user's IP address.
 * Input:
 *   - A callback (to pass back an error or the IP string)
 * Returns (via Callback):
 *   - An error, if any (nullable)
 *   - The IP address as a string (null if error). Example: "162.245.144.188"
 * */

const request = require('request');

const fetchMyIP = function(callback) {
  // use request to fetch IP address from JSON API
  request('https://api.ipify.org?format=json', (error, response, body) => {
    
    // passing error through callback if error is true
    if (error) return callback(error, null);

    if (response.statusCode !== 200) {
      callback(Error(`Status Code ${response.statusCode} when fetching IP: ${body}`), null);
      return;
    }
    const myIP = JSON.parse(body).ip;
    //if not error, passing body (IP) through callback which will console log it to terminal
    if (myIP) {
      callback(null, myIP);
    }
  });
};


const fetchCoordsByIP = function(ip, callback) {

  // fetchCoordsByIP('199.167.156.6', (err, data) => {

  request(`https://freegeoip.app/json/${ip}`, (error, response, body) => {
    if (error) {
      callback(error, null);
      return;
    }

    if (response.statusCode !== 200) {
      const msg = `Status Code ${response.statusCode} when fetching coordinates for IP. Response: ${body}`;
      callback(Error(msg), null);
      return;
    }
  
    // parsing object
    const data = JSON.parse(body);

    // extracting long/lat and creating an object with the two key/value pairs
    const longitude = data.longitude;
    const latitude = data.latitude;
    const geolocation = { longitude: longitude, latitude: latitude };

    if (data) {
      callback(null, geolocation);
    }
    
  });
};

const fetchISSFlyOverTimes = function(coords, callback) {

  request(`http://api.open-notify.org/iss-pass.json?lat=${coords.latitude}&lon=${coords.longitude}`, (error, response, body) => {
    if (error) {
      callback(error, null);
      return;
    }

    if (response.statusCode !== 200) {
      const msg = `Status Code ${response.statusCode} when fetching flyover times. Response: ${body}`;
      callback(Error(msg), null);
      return;
    }
  
    const data = JSON.parse(body);
    
    if (data) {
      callback(null, data.response);
    }

  });
}


const nextISSTimesForMyLocation = function(callback) {
  fetchMyIP((error, ip) => {
  if (error) {
    return callback(error, null);
  } 

    fetchCoordsByIP(ip, (error, loc) => {
      if(error) {
        return callback(error, null);
      }
      fetchISSFlyOverTimes(loc, (error, nextPasses) => {
        if(error) {
          return callback(error, null);
        }

        callback(null, nextPasses);
      })

    })
  })
}


module.exports = { nextISSTimesForMyLocation };