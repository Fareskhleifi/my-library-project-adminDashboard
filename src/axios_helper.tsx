import axios, { Method, AxiosRequestConfig, AxiosResponse } from 'axios';

axios.defaults.baseURL = 'http://localhost:8080';
axios.defaults.headers.post['Content-Type'] = 'application/json';

// Custom request function
export const request = async (
  method: Method,
  url: string,
  data?: any,
  headers: Record<string, string> = {}
): Promise<AxiosResponse<any>> => {
  
  const token = localStorage.getItem('token');

  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  const config: AxiosRequestConfig = {
    method: method,
    url: url,
    data: data,
    headers: headers,
  };

  try {
    const response = await axios(config);
    return response;
  } catch (error) {
    console.error('Error making request:', error);
    throw error;
  }
};
