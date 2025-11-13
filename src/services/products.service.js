import apiClient from '../config/axios.config';

export const getProducts = async () => {
  try {
    const { data } = await apiClient.get('/products');
    return data;
  } catch (error) {
    console.error('Error al obtener productos:', error);
    return [];
  }
};

export const createProduct = async (productData) => {
  try {
    const { data } = await apiClient.post('/products', productData);
    return data;
  } catch (error) {
    console.error('Error al crear producto:', error);
    throw error; // Re-lanzamos el error para que el formulario lo maneje
  }
};

export const updateProduct = async (id, productData) => {
  try {
    const { data } = await apiClient.put(`/products/${id}`, productData);
    return data;
  } catch (error) {
    console.error('Error al actualizar producto:', error);
    throw error;
  }
};

export const deleteProduct = async (id) => {
  try {
    await apiClient.delete(`/products/${id}`);
  } catch (error) {
    console.error('Error al eliminar producto:', error);
    throw error;
  }
};