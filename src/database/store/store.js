import {applyMiddleware, createStore} from 'redux';
import {mainReducer} from '../reducers/main';
import {loggerMiddleware} from '../middlewares/loggerMiddleware';

export const store = createStore(
  mainReducer,
  undefined,
  applyMiddleware(loggerMiddleware)
);
