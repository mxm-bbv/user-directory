import axios from 'axios';

const apiClient = axios.create({
  baseURL: 'https://api.user-directory.local/api/v1',
  headers: {
    Accept: 'application/json',
  },
});

export default apiClient;
