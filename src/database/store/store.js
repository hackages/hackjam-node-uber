import {applyMiddleware, createStore} from 'redux';
import {mainReducer} from '../reducers/main';
import {loggerMiddleware} from '../middlewares/loggerMiddleware';
import {tripsMiddleware} from '../middlewares/tripsMiddleware';

export const store = createStore(
  mainReducer,
  undefined,
  applyMiddleware(tripsMiddleware, loggerMiddleware)
);
