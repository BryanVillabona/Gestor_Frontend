import apiClient from '../config/axios.config';

export const getInventory = async () => {
  try {
    const { data } = await apiClient.get('/inventory');
    return data;
  } catch (error) {
    console.error('Error al obtener inventario:', error);
    return [];
  }
};

export const addStock = async (stockData) => {
  try {
    const { data } = await apiClient.post('/inventory/add', stockData);
    return data;
  } catch (error) {
    console.error('Error al añadir stock:', error);
    throw error;
  }
};

export const updateStock = async (inventoryId, quantity) => {
  try {
    const { data } = await apiClient.put(`/inventory/${inventoryId}`, { quantity });
    return data;
  } catch (error) {
    console.error('Error al actualizar stock:', error);
    throw error.response?.data || error;
  }
};