import Joi from 'joi';

export const coordinateSchema = Joi.object().keys({
  latitude: Joi.number().required(),
  longitude: Joi.number().required()
});
