// will require main fetch function

// const { fetchMyIP, fetchCoordsByIP, fetchISSFlyOverTimes } = require('./iss');

// fetchMyIP((error, ip) => {
//   if (error) {
//     console.log("It didn't work", error);
//     return;
//   }

//   console.log("It worked! Returned IP: ", ip);
  
// });

// fetchCoordsByIP('199.167.156.6', (error, geolocation) => {
//   if (error) {
//     console.log("It didn't work", error);
//     return;
//   }

//   console.log("It worked! Returned geolocation: ", geolocation);
// });


// fetchISSFlyOverTimes({latitude: 43.6319, longitude: -79.3716}, (error, flyover) => {
//   if (error) {
//     console.log("It didn't work", error);
//     return;
//   }

//   console.log("It worked! The flyover times: ", flyover);
// });


const { nextISSTimesForMyLocation } = require('./iss');

const printPassTimes = function(passTimes) {
  for(const pass of passTimes) {
    const datetime = new Date(0);
    datetime.setUTCSeconds(pass.risetime);
    const duration = pass.duration;
    console.log(`Next pass at ${datetime} for ${duration} seconds!`);
  }
};

nextISSTimesForMyLocation((error, passTimes) => {
  if (error) {
    return console.log("It didn't work!", error);
  }
  // success, print out the deets!
  printPassTimes(passTimes);
});
