import {USER} from '../constants/actionTypes';

const initialState = {
  data: null,
  isFetching: false,
  error: false,
};

const userReducer = (state = initialState, action) => {
  switch (action.type) {
    case USER.FETCHING_DATA_SUCCESS:
      return {
        ...state,
        data: action.payload,
        isFetching: false,
        error: false,
      };
    case USER.FETCHING_DATA_FAILURE:
      return {
        ...state,
        isFetching: false,
        error: true,
        data: null,
      };
    default:
      return state;
  }
};

export default userReducer;
