import apiClient from '../config/axios.config';

export const createSale = async (saleData) => {
  try {
    const { data } = await apiClient.post('/sales', saleData);
    return data;
  } catch (error) {
    console.error('Error al crear la venta:', error);
    // Lanza el error para que el formulario lo atrape y muestre
    throw error.response?.data || error; 
  }
};

export const getSales = async () => {
  try {
    const { data } = await apiClient.get('/sales');
    return data;
  } catch (error) {
    console.error('Error al obtener historial de ventas:', error);
    return [];
  }
};