import express from 'express';
import bodyParser from 'body-parser';
import {carsRouter} from './routes/cars';
import {requestLogger} from './middlewares/requestsLogger';
import {authMiddleware} from './middlewares/authMiddleware';
import {tripsRouter} from './routes/trips';
import {TripsController} from './controllers/trips';
import {CarController} from './controllers/cars';
import geolib from 'geolib';
import socketio from 'socket.io';
import {Server} from 'http';
import {sendClosestCar} from './database/middlewares/tripsMiddleware';
import {catchNotFound, errorHandler} from './utils/errorHandling';

const app = express();
const server = Server(app);
const io = socketio(server);

/**
 * Plug the requestLogger, the auth middleware and bodyParser here
 */
app.use(requestLogger);
app.use(authMiddleware);
app.use(bodyParser.json());

/**
 * Plug the cars router and the trips router on /cars and /trips respectively
 */
app.use('/cars', carsRouter);
app.use('/trips', tripsRouter);

/**
 * You should also plug the error handler and the 404 not found
 */
app.use(catchNotFound);
app.use(errorHandler);

server.listen(process.env.port || 8080);

CarController.create({
  name: 'Tesla Model S'
});

const CAR_UPDATE_INTERVAL_MS = 1000;
const TRIP_UPDATE_INTERVAL_MS = 10000;

function updateTrips() {
  TripsController.getAll().forEach(trip => {
    // Try to assign a car to the trip
    if (!trip.car_uuid) {
      sendClosestCar(trip);
    }

    if (trip.car_uuid) {
      const car = CarController.getById(trip.car_uuid);
      const carSpeedFactor = car.speedFactor || 1;

      // Initialize the trip if not done yet
      let newTripStepIndex = trip.currentStepIndex || 0;
      let travelTimeRemainingMs = CAR_UPDATE_INTERVAL_MS;
      let newCarLocation = car.coordinate;
      let newCarBearing = car.bearing;
      let newCarSpeed = car.speed;

      while (travelTimeRemainingMs > 0) {
        const endCoordinate = trip.steps[newTripStepIndex];
        const distanceToEndCoordinate = geolib.getDistance(
          car.coordinate,
          endCoordinate
        );
        const speedToEndCoordinate = endCoordinate.speed * carSpeedFactor;
        const timeToEndCoordinateMs =
          1000 * distanceToEndCoordinate / speedToEndCoordinate;

        // We don't have time to reach the next step in this update
        if (timeToEndCoordinateMs > travelTimeRemainingMs) {
          // Just move towards it
          newCarBearing = geolib.getBearing(car.coordinate, endCoordinate);

          newCarLocation = geolib.computeDestinationPoint(
            car.coordinate,
            speedToEndCoordinate * (travelTimeRemainingMs / 1000),
            newCarBearing
          );

          newCarSpeed = speedToEndCoordinate;
          travelTimeRemainingMs = 0;
        } else {
          // Let's just go to the destination and update our time remaining.
          travelTimeRemainingMs = travelTimeRemainingMs - timeToEndCoordinateMs;
          newCarLocation = endCoordinate;
          newCarSpeed = speedToEndCoordinate;

          // Update the trip to move on to the next step.
          if (newTripStepIndex === trip.steps.length - 1) {
            return TripsController.deleteById(trip.uuid);
          }

          newTripStepIndex = newTripStepIndex + 1;
        }
      }
      CarController.update({
        ...car,
        coordinate: newCarLocation,
        bearing: newCarBearing,
        speed: newCarSpeed
      });
      TripsController.update({...trip, currentStepIndex: newTripStepIndex});
    }
  });
}

setInterval(() => {
  updateTrips();
  io.emit('cars', JSON.stringify(CarController.getAll()));
}, CAR_UPDATE_INTERVAL_MS);

setInterval(() => {
  io.emit('trips', JSON.stringify(TripsController.getAll()));
}, TRIP_UPDATE_INTERVAL_MS);
