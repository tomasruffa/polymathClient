import {USER} from '../constants/actionTypes';
import {getMe, postLogin, postRegister} from '../../services';

export const getData = () => {
  return {type: USER.FETCHING_DATA};
};

export const getDataSuccess = data => {
  localStorage.setItem("user",JSON.stringify(data))
  return {type: USER.FETCHING_DATA_SUCCESS, payload: data};
};

export const getDataFailure = error => {
  localStorage.clear();
  return {type: USER.FETCHING_DATA_FAILURE, payload: error};
};

export const fetchMe = () => {
  return dispatch => {
    dispatch(getData());
    getMe()
      .then(({data}) => {
        dispatch(getDataSuccess(data.user));
      })
      .catch(reason => {
        console.log(reason);
        dispatch(getDataFailure('Error validating remote infromation'));
      });
  };
};

export const register = (data) => {
  return dispatch => {
    dispatch(getData());
    console.log("getMe");
    postRegister(data)
      .then(({data}) => {
        if(data.userExists) {
          alert('User exist in our database')
        } else {
          localStorage.setItem('user', JSON.stringify(data.user));
  
          dispatch(getDataSuccess(data.user));
        }
      })
      .catch(reason => {
        dispatch(getDataFailure('Error validating remote infromation'));
      });
  };
};

export const login = (props) => {
  return dispatch => {
    dispatch(getData());
    postLogin(props)
      .then(({data}) => {
        if(data.errorMessage) {
          alert('User or password incorrect')
        } else {
          dispatch(getDataSuccess(data.user));
        }
      })
      .catch(reason => {
        dispatch(getDataFailure('Error validando la información remota'));
      });
  };
};

export const logOut = (props) => {
  return dispatch => {
    dispatch(getData());

    dispatch(getDataSuccess(null));
    localStorage.clear();
     
  };
};
