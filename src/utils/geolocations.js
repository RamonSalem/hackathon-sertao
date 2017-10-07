

const NodeGeocoder = require('node-geocoder');

const options = {
  provider: 'google',
  httpAdapter: 'https', 
  apiKey: 'AIzaSyD9B3CEE7x9n6n5vxQIhAYbT-VEDr9DRR0', // for Mapquest, OpenCage, Google Premier
  formatter: null,
  language : "pt-BR"
};

const geocoder = NodeGeocoder(options);

/*
    returns:
        region : {
            city : city,
            country : country,
            state : state
        },
        loc : [longitude, latitude],
    

*/ 

exports.getLocationsInfo = (address)=>{

    return geocoder.geocode(address)
    .then(data=>{
        const region = {
            city : data[0].administrativeLevels.level2long,
            country : data[0].country,
            state : data[0].administrativeLevels.level1long
        };
        const loc = [data[0].longitude, data[0].latitude];
        return {region : region, loc : loc, status : 'Ok'};
    })
    .catch(err=>{
        return {data: err, code : 500, message : 'Could not get geolocations info, or address'};
    });
}

/*
exports.getLocationsInfo = (address)=>{
    return new Promise((resolve, reject)=>{
        reject({data: 'ERRO teste', code : 500, message : 'Could not get geolocations info, or address'});
    })
}
*/

/*
[{
  latitude: 48.8698679,
  longitude: 2.3072976,
  country: 'France',
  countryCode: 'FR',
  city: 'Paris',
  zipcode: '75008',
  streetName: 'Champs-Élysées',
  streetNumber: '29',
  administrativeLevels: {
    level1long: 'Île-de-France',
    level1short: 'IDF',
    level2long: 'Paris',
    level2short: '75'
  },
  provider: 'google'
}]*/
