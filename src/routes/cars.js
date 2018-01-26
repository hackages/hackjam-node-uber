import {Router} from 'express';
import {CarController} from '../controllers/cars';
import {validateBody} from '../middlewares/schemaMiddleware';
import {carSchema} from '../schemas/cars';

/**
 * Create a CRUD for the cars
 * You can use the methods found in the cars controller to update the DB infos accordingly
 */
export const carsRouter = Router();

/**
 * This route takes an optional ID, if the client doesnt give you an id you must get all the cars
 * otherwise just return the car that matches the ID
 */
carsRouter.get('/:id?', (req, res) => {
  const {id} = req.params;
  if (id) {
    return res.json(CarController.getById(id));
  }
  res.json(CarController.getAll());
});

/**
 * This method is used to create new cars
 * It'll receive an object with a name property from the client in the body of the request
 */
carsRouter.post('/', validateBody(carSchema), (req, res) => {
  const newCar = CarController.create(req.value.body);
  res.json(newCar);
});

/**
 * This route must delete a car by id
 */
carsRouter.delete('/:id', (req, res) => {
  CarController.deleteById(req.params.id);
  res.sendStatus(204);
});

/**
 * This route is used to update cars, it receives an ID
 */
carsRouter.patch('/:id', (req, res) => {
  CarController.update({...req.body, uuid: req.params.id});
  const car = CarController.getById(req.params.id);
  res.status(200);
  res.json(car);
});
