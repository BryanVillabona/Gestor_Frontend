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

const exportSalesToExcel = async (startDate, endDate) => {
  try {
    const { data } = await apiClient.get('/reports/export/sales', {
      params: { startDate, endDate },
      responseType: 'blob', // ¡Súper importante! Le dice a Axios que baje un archivo
    });

    // 1. Crear un Blob (archivo en memoria)
    const blob = new Blob([data], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });

    // 2. Crear un link temporal en el navegador
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    
    // 3. Ponerle nombre al archivo
    const fileName = `Reporte_Ventas_${startDate}_${endDate}.xlsx`;
    link.setAttribute('download', fileName);

    // 4. Simular clic para descargar
    document.body.appendChild(link);
    link.click();

    // 5. Limpiar (borrar el link temporal)
    link.parentNode.removeChild(link);
    window.URL.revokeObjectURL(url);
    
    return true; // Éxito

  } catch (error) {
    console.error('Error al exportar Excel:', error);
    // Manejo de error si el servidor devuelve un error JSON en lugar de un blob
    if (error.response && error.response.data.toString() === '[object Blob]') {
        const errorText = await error.response.data.text();
        const errorJson = JSON.parse(errorText);
        throw new Error(errorJson.error || 'Error al generar el archivo');
    }
    throw new Error(error.message || 'Error desconocido al descargar');
  }
};

export { 
  getDashboardKPIs, 
  getTotalPortfolio, 
  getInventoryAlerts, 
  getCustomerPortfolio,
  getSalesByDateRange,
  getDebtorCustomers,
  exportSalesToExcel,
};