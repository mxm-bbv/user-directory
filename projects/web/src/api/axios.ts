import axios from 'axios';

export const apiClient = axios.create({
    baseURL: 'https://api.user-directory.local/api/v1',
    headers: {
        Accept: 'application/json',
    },
});