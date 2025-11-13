import React, { useState, useEffect } from 'react';
import { getSales } from '../../../services/sales.service';

// Formateadores
const currencyFormatter = new Intl.NumberFormat('es-CO', {
  style: 'currency',
  currency: 'COP',
  maximumFractionDigits: 0,
});
const dateFormatter = (dateString) => {
  return new Date(dateString).toLocaleDateString('es-CO', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
};

const SalesHistory = () => {
  const [sales, setSales] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchSales = async () => {
      try {
        setIsLoading(true);
        const data = await getSales();
        setSales(data);
      } catch (error) {
        console.error(error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchSales();
  }, []);

  if (isLoading) {
    return <p>Cargando historial de ventas...</p>;
  }

  return (
    <section className="mt-6">
      <div className="bg-white dark:bg-gray-900/50 rounded-xl border border-gray-200 dark:border-gray-800 overflow-hidden">
        <div className="p-5">
          <h2 className="text-gray-900 dark:text-white text-lg font-bold">
            Historial de Ventas
          </h2>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead className="bg-gray-50 dark:bg-white/5">
              <tr>
                <th className="p-4 text-sm font-semibold text-gray-600 dark:text-gray-300">Fecha</th>
                <th className="p-4 text-sm font-semibold text-gray-600 dark:text-gray-300">Cliente</th>
                <th className="p-4 text-sm font-semibold text-gray-600 dark:text-gray-300 text-right">Total Venta</th>
                <th className="p-4 text-sm font-semibold text-gray-600 dark:text-gray-300 text-right">Pagado</th>
                <th className="p-4 text-sm font-semibold text-gray-600 dark:text-gray-300 text-right">Pendiente</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200 dark:divide-gray-800">
              {sales.map((sale) => (
                <tr key={sale._id}>
                  <td className="p-4 text-sm font-medium text-gray-800 dark:text-gray-200">
                    {dateFormatter(sale.date)}
                  </td>
                  <td className="p-4 text-sm text-gray-600 dark:text-gray-400">
                    {sale.customerId?.name || 'Cliente Eliminado'}
                  </td>
                  <td className="p-4 text-sm text-gray-600 dark:text-gray-400 text-right">
                    {currencyFormatter.format(sale.totalAmount)}
                  </td>
                  <td className="p-4 text-sm text-green-600 dark:text-green-400 text-right">
                    {currencyFormatter.format(sale.amountPaid)}
                  </td>
                  <td className="p-4 text-sm text-red-600 dark:text-red-400 text-right">
                    {currencyFormatter.format(sale.amountPending)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </section>
  );
};

export default SalesHistory;