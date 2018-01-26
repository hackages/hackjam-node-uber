/* eslint-disable no-console */
/**
 * This middleware must log the http method used and the url
 * You can obviously spice it up with whatever other info you'd like ;)
 *
 * Ex:
 *
 * GET /trips
 */
export const requestLogger = (req, res, next) => {
  const {method, url} = req;
  console.log(method, url);
  next();
};
