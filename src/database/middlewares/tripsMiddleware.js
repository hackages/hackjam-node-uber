import {getClosestFrom, getDirections} from '../../libs/maps';
import {getSleepingCars} from '../selectors/cars';
import {updateTripAction} from '../reducers/tripsReducer';
import {store} from '../store/store';

export const sendClosestCar = async trip => {
  const {coordinate} = trip;
  const availableCars = getSleepingCars(store.getState());
  const car = getClosestFrom(availableCars, coordinate);
  if (!car) {
    return;
  }
  const directions = await getDirections({
    origin: car.coordinate,
    destination: coordinate
  });
  store.dispatch(
    updateTripAction({
      ...trip,
      car_uuid: car.uuid,
      ...directions
    })
  );
};

export const tripsMiddleware = () => next => async action => {
  const {type} = action;
  next(action);
  if (type === 'CREATE_TRIP') {
    sendClosestCar(action.payload);
  }
};
