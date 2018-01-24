const reducer = {
  CREATE_TRIP: (state, payload) => ({
    ...state,
    [payload.uuid]: {
      ...payload
    }
  }),
  DELETE_TRIP: (state, payload) =>
    Object.keys(state).reduce(
      (acc, next) => ({
        ...acc,
        ...() => (next === payload ? {} : state[next])
      }),
      {}
    ),
  UPDATE_TRIP: (state, payload) => ({
    ...state,
    [payload.uuid]: {
      ...state[payload.uuid],
      ...payload,
      uuid: payload.uuid
    }
  })
};

export const tripsReducer = (state = {}, {type, payload} = {}) =>
  reducer[type] ? reducer[type](state, payload) : state;

export const deleteTripAction = uuid => ({
  type: 'DELETE_TRIP',
  payload: uuid
});

export const updateTripAction = tripData => ({
  type: 'UPDATE_TRIP',
  payload: tripData
});

export const createTripAction = tripData => ({
  type: 'CREATE_TRIP',
  payload: tripData
});
