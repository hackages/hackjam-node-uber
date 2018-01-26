/* eslint-disable no-console */
export const loggerMiddleware = ({getState}) => next => action => {
  console.log('logger ---------------------------------------------');
  console.log('action', JSON.stringify(action));
  next(action);
  console.log('next state', JSON.stringify(getState()));
  console.log('logger ---------------------------------------------');
};
