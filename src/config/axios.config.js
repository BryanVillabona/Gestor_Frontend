import axios from 'axios';

// Creamos una instancia de axios
const apiClient = axios.create({
  baseURL: 'http://localhost:3000/api/v1', // La URL base de nuestro backend
  headers: {
    'Content-Type': 'application/json',
  },
});

export default apiClient;