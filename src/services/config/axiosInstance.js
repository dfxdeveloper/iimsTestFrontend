import axios from 'axios';

const BASE_URL = process.env.REACT_APP_BASE_URL || "http://localhost:5000/api/v1";

const axiosInstance = axios.create({
  baseURL: BASE_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor
axiosInstance.interceptors.request.use(
  (config) => {
    try {
      const userData = JSON.parse(localStorage.getItem('user') || '{}');
        if (userData?.token) {
          config.headers.Authorization = `Bearer ${userData.token}`;
        }
      
    } catch (error) {
      console.error('Error parsing user data:', error);
      localStorage.clear();
      window.location.href = '/login';
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor
axiosInstance.interceptors.response.use(
  (response) => {
    return response.data;
  },
  (error) => {
    if (error.response) {
      switch (error.response.status) {
        case 401:
          localStorage.clear();
          window.location.href = '/login';
          break;
        case 403:
          console.error('Access Forbidden - Admin privileges required');
          break;
        case 404:
          console.error('Resource Not Found');
          break;
        case 500:
          console.error('Server Error');
          break;
        default:
          console.error('An error occurred');
      }
      
      return Promise.reject(error.response.data);
    } else if (error.request) {
      return Promise.reject({
        message: 'No response from server. Please check your internet connection.'
      });
    } else {
      return Promise.reject({
        message: 'Error in making request. Please try again.'
      });
    }
  }
);

export const api = {
  get: (url, config = {}) => axiosInstance.get(url, config),
  post: (url, data = {}, config = {}) => axiosInstance.post(url, data, config),
  put: (url, data = {}, config = {}) => axiosInstance.put(url, data, config),
  delete: (url, config = {}) => axiosInstance.delete(url, config),
  patch: (url, data = {}, config = {}) => axiosInstance.patch(url, data, config),
};

export default axiosInstance;
