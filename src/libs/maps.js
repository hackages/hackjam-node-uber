import geolib from 'geolib';
import {createClient} from '@google/maps';
import plUtility from '@mapbox/polyline';

const gmapsClient = createClient({
  key: process.env.TOKEN
});

const getLeg = trip => trip.routes[0].legs[0];

export const extractTrip = tripData => {
  const {end_address, coordinate: end_coordinate, steps: rawSteps} = getLeg(
    tripData
  );

  const coords = rawSteps.map(({polyline: {points}, duration, distance}) => ({
    speed: distance.value / duration.value,
    polyline: plUtility.decode(points)
  }));

  const steps = coords.reduce(
    (acc, nextStep) => [
      ...acc,
      ...nextStep.polyline.map(([latitude, longitude]) => ({
        latitude,
        longitude,
        speed: nextStep.speed
      }))
    ],
    []
  );

  return {
    end_address,
    end_coordinate,
    steps
  };
};

/**
 *
 * @param destination: object containing a latitude and a longitude
 * @param origin: object containing a latitude and a longitude
 * @returns {Promise}: resolves the trip datas 
 */
export const getDirections = async ({destination, origin}) => {
  return new Promise((res, rej) => {
    gmapsClient.directions(
      {
        destination,
        origin
      },
      (err, data) => {
        if (err) {
          return rej(err);
        }
        res(extractTrip(data.json));
      }
    );
  });
};

export const getClosestFrom = (cars, destination) => {
  let closest = {
    distance: Number.MAX_SAFE_INTEGER,
    car: null
  };
  for (let car of cars) {
    const distance = geolib.getDistance(car.coordinate, destination);
    if (distance < closest.distance) {
      closest = {
        distance,
        car
      };
    }
  }
  return closest.car;
};
