import apiClient from '../config/axios.config';

const getDashboardKPIs = async () => {
  try {
    const { data } = await apiClient.get('/reports/dashboard-kpis');
    return data;
  } catch (error) {
    console.error('Error fetching KPIs:', error);
    return { totalSalesToday: 0, totalIncomeToday: 0, totalIncomeMonth: 0 };
  }
};

const getTotalPortfolio = async () => {
  try {
    const { data } = await apiClient.get('/reports/total-portfolio');
    return data;
  } catch (error) {
    console.error('Error fetching portfolio:', error);
    return { totalPortfolio: 0 };
  }
};

const getInventoryAlerts = async () => {
  try {
    const { data } = await apiClient.get('/reports/inventory-alerts');
    return data;
  } catch (error) {
    console.error('Error fetching alerts:', error);
    return [];
  }
};

const getCustomerPortfolio = async (customerId) => {
  try {
    const { data } = await apiClient.get(`/reports/customer-portfolio/${customerId}`);
    return data;
  } catch (error) {
    console.error('Error al obtener cartera del cliente:', error);
    throw error.response?.data || error;
  }
};

const getSalesByDateRange = async (startDate, endDate) => {
  try {
    // Pasamos las fechas como query params
    const { data } = await apiClient.get('/reports/sales-by-date', {
      params: { startDate, endDate },
    });
    return data;
  } catch (error) {
    console.error('Error al obtener reporte de ventas:', error);
    throw error.response?.data || error;
  }
};

const getDebtorCustomers = async () => {
  try {
    const { data } = await apiClient.get('/reports/debtor-customers');
    return data;
  } catch (error) {
    console.error('Error al obtener reporte de deudores:', error);
    throw error.response?.data || error;
  }
};

export { 
  getDashboardKPIs, 
  getTotalPortfolio, 
  getInventoryAlerts, 
  getCustomerPortfolio,
  getSalesByDateRange,
  getDebtorCustomers,
};