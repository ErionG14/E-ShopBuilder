import axios from 'axios';

// Create an Axios instance
const apiClient = axios.create({
    baseURL: process.env.REACT_APP_API_URL || 'http://localhost:5000/api/v1',
    headers: {
        'Content-Type': 'application/json',
    },
});

// Request interceptor to add the auth token
apiClient.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem('token'); // Or from context/cookie
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

// Response interceptor for global error handling
apiClient.interceptors.response.use(
    (response) => response,
    (error) => {
        if (error.response) {
            // Handle 401 Unauthorized (e.g., redirect to login)
            if (error.response.status === 401) {
                // Event bus or direct redirect could go here
                console.error('Unauthorized access');
            }
            // Handle other status codes
        }
        return Promise.reject(error);
    }
);

export default apiClient;
