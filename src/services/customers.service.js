import apiClient from '../config/axios.config';

export const getCustomers = async () => {
  try {
    const { data } = await apiClient.get('/customers');
    return data;
  } catch (error) {
    console.error('Error al obtener clientes:', error);
    return [];
  }
};

// Dejaremos create/update/delete para cuando implementemos el Módulo 4