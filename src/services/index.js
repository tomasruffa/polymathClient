import axios from 'axios';

const AxiosDefault = axios.create({
  headers: {'Content-Type': 'application/json', 'Cache-Control': 'no-cache'},
  timeout: 10000,
  baseURL: 'http://localhost:3000/api/'
});


AxiosDefault.interceptors.request.use(
  async (config) => {
    const token = localStorage.getItem('Authorization');
    if (token) {
      config.headers.common["Authorization"] = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

AxiosDefault.interceptors.response.use(
  async (response) => {
    if (response.headers.token) {
      localStorage.setItem('Authorization', response.headers.token)
    }
    return response;
  },
  async (error) => {
    let {response} = error;
    if (
      response.status == 401 && response.data.error === "Token Expired"
    ) {
      localStorage.removeItem('Authorization')
      localStorage.removeItem('user')
      if(window.location.pathname != "/login")alert("Token Expired")

      window.location.pathname = "/login"
    }else{
      console.log(error)
    }
    return Promise.reject(error);
  }
);

const post = async (url, params) => {
  try {
    const response = await AxiosDefault.post(url, params);
    if (response.status >= 400) {
      throw (response.statusText, response.status);
    }
    return response;
  } catch (error) {
    throw error
  }
};

const get = async (url, params) => {
  try {
    const response = await AxiosDefault.get(url, params);
    if (response.status >= 400) {
      throw (response.statusText, response.status);
    }
    return response;
  } catch (error) {
    throw error
  }
};

const put = async (url, params) => {
  try {
    const response = await AxiosDefault.put(url, params);
    if (response.status >= 400) {
      throw (response.statusText, response.status);
    }
    return response;
  } catch (error) {
    throw error
  }
};

export const getMe = async () => {
  const userData = await get('auth/me');
  return userData;
};

export const postLogin = async (params) => {
  return post('auth/login', params);
}

export const postRegister = async (params) => {
  return post('auth/register', params);
}

export const searchTask = async (params) => {
  return post('task/search', params);
}

export const updateTask = (params) => {
  return put('task/update', params);
}

export const deleteTask = (params) => {
  return post('task/delete', params);
}

export const createTask = (params) => {
  return post('task/create', params);
}

export const getTask = (params) => {
  return post('task/get', params);
}

//Exports
export default {
  postLogin,
  searchTask,
  postRegister,
  updateTask,
  deleteTask,
  createTask,
  getTask
};
