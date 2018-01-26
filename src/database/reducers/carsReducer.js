const reducer = {
  ADD_CAR: (state, payload) => ({
    ...state,
    [payload.uuid]: {
      ...payload
    }
  }),
  DELETE_CAR: (state, payload) =>
    Object.keys(state).reduce(
      (acc, next) => (next === payload ? acc : {...acc, [next]: state[next]}),
      {}
    ),
  UPDATE_CAR: (state, payload) => ({
    ...state,
    [payload.uuid]: {
      ...state[payload.uuid],
      ...payload,
      uuid: payload.uuid
    }
  })
};

export const carsReducer = (state = {}, {type, payload} = {}) =>
  reducer[type] ? reducer[type](state, payload) : state;

export const addCar = carData => ({
  type: 'ADD_CAR',
  payload: carData
});

export const removeCar = id => {
  return {
    type: 'DELETE_CAR',
    payload: id
  };
};

export const updateCarAction = carData => ({
  type: 'UPDATE_CAR',
  payload: carData
});
