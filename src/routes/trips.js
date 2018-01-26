import {Router} from 'express';
import {TripsController} from '../controllers/trips';

/**
 * You only need to create two routes here, one to get all the trips and one to
 * create new trips 
 */
export const tripsRouter = Router();

tripsRouter.get('/', (req, res) => {
  res.json(TripsController.getAll());
});

tripsRouter.post('/', (req, res) => {
  const trip = TripsController.create(req.body);
  res.json(trip);
});

tripsRouter.patch('/:id', (req, res) => {
  const {id} = req.params;
  TripsController.update({
    ...req.params.body,
    uuid: id
  });
  const trip = TripsController.getById(id);
  res.status(200);
  res.json(trip);
});

tripsRouter.delete('/:id', (req, res) => {
  TripsController.deleteById(req.params.id);
  res.sendStatus(204);
});
