import axios from "axios";

// Use environment variable for API URL, fallback to localhost for development
const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:3001';

const service = axios.create({
  baseURL: API_BASE_URL,
  withCredentials: true,
  timeout: 300000,
  headers: {
    "Content-Type": "application/json"
  }
});

service.interceptors.response.use(
  (response) => {
    // Handle different response formats from different servers
    const data = response.data;
    
    // Log response for debugging (remove in production)
    console.log('API Response received:', {
      url: response.config.url,
      status: response.status,
      data: data
    });
    
    // Format 1: {code: 200, content: ...} (current server format)
    if (data && typeof data === 'object' && !Array.isArray(data)) {
      if (data.code === 200) {
        return data.content;
      }
      // Format 2: {success: true, data: ...}
      if (data.success && data.data) {
        return data.data;
      }
      // Format 3: Direct object with id (for saveRecord)
      if (data.id) {
        return data;
      }
      // Format 4: Error response
      if (data.code && data.code !== 200) {
        console.warn('API returned non-200 code:', data.code, data);
        return false;
      }
    }
    
    // Format 5: Direct array (for getRecord)
    if (Array.isArray(data)) {
      return data;
    }
    
    // Format 6: Direct string/primitive
    if (data !== null && data !== undefined) {
      return data;
    }
    
    // Fallback: return false if no valid data
    return false;
  },
  (error) => {
    console.error('API Request failed:', {
      url: error.config?.url,
      method: error.config?.method,
      status: error.response?.status,
      statusText: error.response?.statusText,
      data: error.response?.data,
      message: error.message
    });
    return false;
  }
);

export default service;

