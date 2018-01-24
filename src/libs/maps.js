import geolib from 'geolib';
import {createClient} from '@google/maps';
import plUtility from '@mapbox/polyline';

const gmapsClient = createClient({
  key: process.env.TOKEN
});

const getLeg = trip => trip.routes[0].legs[0];

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
        res(getLeg(data.json));
      }
    );
  });
};
