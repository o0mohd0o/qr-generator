import axios from 'axios';

// Create an axios instance with default config
const api = axios.create({
  baseURL: process.env.REACT_APP_API_URL || 'http://localhost:8000/api',
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
    'X-Requested-With': 'XMLHttpRequest', // Important for Laravel to identify AJAX requests
  },
  withCredentials: true, // Important for cookies/CSRF
});

// Function to get CSRF token
export const getCsrfToken = async () => {
  try {
    // Using axios directly without the instance to avoid circular dependencies
    const response = await axios.get('http://localhost:8000/sanctum/csrf-cookie', {
      withCredentials: true,
    });
    console.log('CSRF cookie set successfully');
    return true;
  } catch (error) {
    console.error('Error getting CSRF token:', error);
    return false;
  }
};

// URL shortening service
export const shortenUrl = async (url) => {
  try {
    // First get CSRF token
    await getCsrfToken();
    
    // Then make the API request
    const response = await api.post('/shorten', { url });
    return response.data;
  } catch (error) {
    console.error('Error shortening URL:', error);
    throw error;
  }
};

// Get URL statistics
export const getUrlStatistics = async (shortCode) => {
  try {
    const response = await api.get(`/stats/${shortCode}`);
    return response.data;
  } catch (error) {
    console.error('Error getting URL statistics:', error);
    throw error;
  }
};

export default api;
