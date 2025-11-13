import apiClient from '../config/axios.config';

export const getDashboardKPIs = async () => {
  try {
    const { data } = await apiClient.get('/reports/dashboard-kpis');
    return data;
  } catch (error) {
    console.error('Error fetching KPIs:', error);
    return { totalSalesToday: 0, totalIncomeToday: 0, totalIncomeMonth: 0 };
  }
};

export const getTotalPortfolio = async () => {
  try {
    const { data } = await apiClient.get('/reports/total-portfolio');
    return data;
  } catch (error) {
    console.error('Error fetching portfolio:', error);
    return { totalPortfolio: 0 };
  }
};

export const getInventoryAlerts = async () => {
  try {
    const { data } = await apiClient.get('/reports/inventory-alerts');
    return data;
  } catch (error) {
    console.error('Error fetching alerts:', error);
    return [];
  }
};