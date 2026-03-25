import axios from 'axios'
import AsyncStorage from '@react-native-async-storage/async-storage';

const baseURL = 'http://192.168.254.17:3000/'

const api = axios.create({
    baseURL,
    withCredentials: true
})

// Request interceptor
api.interceptors.request.use(
  async  (config) => {
        // Get token from localStorage
      const token = await AsyncStorage.getItem('token');
        if (token) {
            config.headers.Authorization = `Bearer ${token}`
        }

        return config
    },
    (error) => {
        return Promise.reject(error)
    }
)

export default api
