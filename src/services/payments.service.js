import apiClient from '../config/axios.config';

export const createPayment = async (paymentData) => {
  try {
    const { data } = await apiClient.post('/payments', paymentData);
    return data;
  } catch (error) {
    console.error('Error al registrar abono:', error);
    throw error.response?.data || error;
  }
};