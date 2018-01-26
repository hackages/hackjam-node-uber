import Joi from 'joi';
import {coordinateSchema} from './coordinate';

/**
 * You should create a JOI schema here that validates the car creation request
 */
export const carSchema = Joi.object().keys({
  color: Joi.string(),
  name: Joi.string().required(),
  latitude: Joi.string(),
  uuid: Joi.string(),
  speed: Joi.number(),
  speedFactor: Joi.number(),
  coordinate: coordinateSchema
});
