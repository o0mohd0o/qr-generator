import axios from 'axios';

// Base URL for API requests - remove /api suffix if it's already included
const rawBaseURL = process.env.REACT_APP_API_URL || 'http://localhost:8000';
const baseURL = rawBaseURL.endsWith('/api') ? rawBaseURL.slice(0, -4) : rawBaseURL;

console.log('DEBUG - Base URL configuration:', {
  rawBaseURL,
  normalizedBaseURL: baseURL,
});

// Create separate axios instances for API and web routes
// This helps avoid confusion between routes that need /api prefix and those that don't
const apiClient = axios.create({
  baseURL: `${baseURL}/api`,
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
    'X-Requested-With': 'XMLHttpRequest', // Important for Laravel to identify AJAX requests
  },
  withCredentials: true, // Important for cookies/CSRF to work with Laravel Sanctum
});

const webClient = axios.create({
  baseURL: baseURL,
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
    'X-Requested-With': 'XMLHttpRequest',
  },
  withCredentials: true,
});

// Add request interceptor to log requests
const addLoggingInterceptors = (client) => {
  client.interceptors.request.use(config => {
    // Ensure there's a slash between baseURL and url if url doesn't start with a slash
    if (config.url && !config.url.startsWith('/')) {
      config.url = '/' + config.url;
    }
    
    console.log(`DEBUG - Request: ${config.method.toUpperCase()} ${config.baseURL}${config.url}`);
    console.log('DEBUG - Full request config:', {
      url: config.url,
      baseURL: config.baseURL,
      method: config.method,
      headers: config.headers,
      withCredentials: config.withCredentials
    });
    return config;
  });

  client.interceptors.response.use(
    response => {
      console.log(`DEBUG - Response: ${response.status} from ${response.config.url}`);
      console.log('DEBUG - Response headers:', response.headers);
      return response;
    },
    error => {
      console.error(
        `DEBUG - Error: ${error.response?.status || 'Network Error'} from ${error.config?.url}`,
        error.response?.data
      );
      console.error('DEBUG - Error config:', error.config);
      return Promise.reject(error);
    }
  );
};

// Add interceptors to both clients
addLoggingInterceptors(apiClient);
addLoggingInterceptors(webClient);

// Function to get CSRF token
export const getCsrfToken = async () => {
  try {
    console.log('DEBUG - Environment variables:', {
      REACT_APP_API_URL: process.env.REACT_APP_API_URL,
      NODE_ENV: process.env.NODE_ENV
    });
    
    // Use native fetch API instead of axios to avoid any prefix issues
    // Use the sanctum/csrf-cookie endpoint directly from the base URL
    const csrfUrl = `${baseURL}/sanctum/csrf-cookie`;
    console.log('DEBUG - Base URL:', baseURL);
    console.log('DEBUG - Requesting CSRF token using fetch from:', csrfUrl);
    
    // Use fetch with the full URL to avoid any middleware or interceptors
    const response = await fetch(csrfUrl, {
      method: 'GET',
      credentials: 'include', // Equivalent to withCredentials: true
      headers: {
        'X-Requested-With': 'XMLHttpRequest',
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      }
    });
    
    console.log('DEBUG - CSRF response:', {
      ok: response.ok,
      status: response.status,
      statusText: response.statusText,
      headers: [...response.headers.entries()].reduce((obj, [key, value]) => {
        obj[key] = value;
        return obj;
      }, {})
    });
    
    if (!response.ok) {
      throw new Error(`Failed to get CSRF token: ${response.status} ${response.statusText}`);
    }
    
    console.log('DEBUG - CSRF cookie response status:', response.status);
    console.log('DEBUG - All cookies after CSRF request:', document.cookie);
    
    // After the request, Laravel should have set the XSRF-TOKEN cookie
    const token = getCookie('XSRF-TOKEN');
    console.log('DEBUG - Cookies after CSRF request:', {
      all: document.cookie,
      xsrfToken: token
    });
    
    if (token) {
      // Laravel expects the token in the X-XSRF-TOKEN header for both clients
      const decodedToken = decodeURIComponent(token);
      apiClient.defaults.headers.common['X-XSRF-TOKEN'] = decodedToken;
      webClient.defaults.headers.common['X-XSRF-TOKEN'] = decodedToken;
      
      console.log('DEBUG - CSRF token set successfully:', {
        token: decodedToken.substring(0, 10) + '...',
        apiClientHeaders: {...apiClient.defaults.headers.common},
        webClientHeaders: {...webClient.defaults.headers.common}
      });
      
      return true;
    } else {
      console.error('DEBUG - CSRF token not found in cookies after sanctum/csrf-cookie request');
      console.log('DEBUG - All available cookies:', document.cookie);
      return false;
    }
  } catch (error) {
    console.error('DEBUG - Error getting CSRF token:', error.message);
    console.error('DEBUG - Error details:', error);
    return false;
  }
};

// Helper function to get cookie by name
function getCookie(name) {
  const value = `; ${document.cookie}`;
  const parts = value.split(`; ${name}=`);
  if (parts.length === 2) return parts.pop().split(';').shift();
}

// URL shortening service
export const shortenUrl = async (url) => {
  try {
    // First get CSRF token
    const csrfSuccess = await getCsrfToken();
    console.log('DEBUG - CSRF token obtained successfully:', csrfSuccess);
    
    if (!csrfSuccess) {
      console.log('DEBUG - Proceeding without CSRF token as it could not be obtained');
    }
    
    // Use the correct API endpoint
    console.log('DEBUG - Sending URL shorten request with data:', { url });
    console.log('DEBUG - API client baseURL:', apiClient.defaults.baseURL);
    
    // Use apiClient which already has the right headers set
    // The interceptor will add the leading slash
    const response = await apiClient.post('shorten', { url });
    console.log('DEBUG - URL shortening response:', response.data);
    
    return response.data;
  } catch (error) {
    console.error('DEBUG - Error shortening URL:', 
      error.response ? `Status: ${error.response.status} - ${JSON.stringify(error.response.data)}` : error.message);
    console.error('DEBUG - Full error:', error);
    throw error;
  }
};

// Get URL statistics
export const getUrlStatistics = async (shortCode) => {
  try {
    // Make sure we have a CSRF token for authenticated requests
    await getCsrfToken();
    
    // Use the correct API endpoint
    console.log('DEBUG - Sending URL stats request for shortCode:', shortCode);
    console.log('DEBUG - API client baseURL:', apiClient.defaults.baseURL);
    
    // The interceptor will add the leading slash
    const response = await apiClient.get(`stats/${shortCode}`);
    console.log('DEBUG - URL statistics response:', response.data);
    
    return response.data;
  } catch (error) {
    console.error('DEBUG - Error getting URL statistics:', 
      error.response ? `Status: ${error.response.status} - ${JSON.stringify(error.response.data)}` : error.message);
    console.error('DEBUG - Full error:', error);
    throw error;
  }
};

// Export the API client as default
export default apiClient;
