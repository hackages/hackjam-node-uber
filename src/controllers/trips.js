import uuid from 'uuid/v4';
import {db} from '../database/db';
import {
  createTripAction,
  deleteTripAction,
  updateTripAction
} from '../database/reducers/tripsReducer';

export class TripsController {
  static getAll = () => {
    return Object.values(db.getState().trips);
  };

  static getById = uuid => {
    return db.getState().trips[uuid];
  };

  static create = tripData => {
    const trip_id = uuid();
    db.dispatch(
      createTripAction({
        ...tripData,
        finished: false,
        uuid: trip_id
      })
    );
    return TripsController.getById(trip_id);
  };

  static update = tripData => {
    db.dispatch(updateTripAction(tripData));
  };

  static deleteById = uuid => {
    db.dispatch(deleteTripAction(uuid));
  };
}

export const deleteTrip = uuid => {
  db.dispatch(deleteTripAction(uuid));
};
