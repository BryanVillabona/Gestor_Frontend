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

export const createCustomer = async (customerData) => {
  try {
    const { data } = await apiClient.post('/customers', customerData);
    return data;
  } catch (error) {
    console.error('Error al crear cliente:', error);
    throw error.response?.data || error;
  }
};

export const updateCustomer = async (id, customerData) => {
  try {
    const { data } = await apiClient.put(`/customers/${id}`, customerData);
    return data;
  } catch (error) {
    console.error('Error al actualizar cliente:', error);
    throw error.response?.data || error;
  }
};

export const deleteCustomer = async (id) => {
  try {
    await apiClient.delete(`/customers/${id}`);
  } catch (error) {
    console.error('Error al eliminar cliente:', error);
    throw error.response?.data || error;
  }
};