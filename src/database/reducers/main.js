import {combineReducers} from 'redux';
import {carsReducer as cars} from './carsReducer';
import {tripsReducer as trips} from './tripsReducer';

export const mainReducer = combineReducers({
  cars,
  trips
});
