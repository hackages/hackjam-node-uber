import {createSelector} from 'reselect';

export const getCars = state => Object.values(state.cars);
export const getTrips = state => Object.values(state.trips);

export const getSleepingCars = createSelector(
  getCars,
  getTrips,
  (cars, trips) => {
    const activeCarIds = trips.map(trip => trip.car_uuid);
    return cars.filter(car => !activeCarIds.includes(car.uuid));
  }
);
