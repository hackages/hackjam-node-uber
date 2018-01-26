import uuid from 'uuid/v4';
import {db} from '../database/db';
import {
  addCar,
  removeCar,
  updateCarAction
} from '../database/reducers/carsReducer';
import {randomColor} from '../utils/utils';
import {SilverSquare} from '../constant/coords';

export class CarController {
  static getAll = () => {
    return Object.values(db.getState().cars);
  };

  static create = data => {
    const car_id = uuid();
    const car = {
      color: randomColor(),
      speed: Math.round(60 * 1000 / 3600),
      bearing: 0,
      coordinate: SilverSquare,
      speedFactor: 3,
      ...data,
      uuid: car_id
    };
    db.dispatch(addCar(car));
    return CarController.getById(car_id);
  };

  static getById = id => {
    return db.getState().cars[id];
  };

  static deleteById = id => {
    db.dispatch(removeCar(id));
  };

  static update = car => {
    db.dispatch(updateCarAction(car));
  };
}
