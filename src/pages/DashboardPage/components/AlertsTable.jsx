import React from 'react';

const AlertsTable = ({ alerts }) => {
  if (alerts.length === 0) {
    return (
      <div className="px-4 py-3">
        <p className="text-gray-500 dark:text-gray-400">
          ¡Todo bien! No hay alertas de inventario.
        </p>
      </div>
    );
  }

  return (
    <div className="px-4 py-3">
      <div className="flex overflow-hidden rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800/50 shadow-sm">
        <table className="flex-1">
          <thead className="bg-gray-50 dark:bg-gray-800">
            <tr>
              <th className="px-4 py-3 text-left text-[#111518] dark:text-gray-300 w-[40%] text-sm font-medium">
                Producto
              </th>
              <th className="px-4 py-3 text-left text-[#111518] dark:text-gray-300 w-[30%] text-sm font-medium">
                Cantidad Restante
              </th>
              <th className="px-4 py-3 text-left text-[#111518] dark:text-gray-300 w-[30%] text-sm font-medium">
                Estado
              </th>
            </tr>
          </thead>
          <tbody>
            {alerts.map((alert, index) => (
              <tr 
                key={index} 
                className="border-t border-t-gray-200 dark:border-t-gray-700"
              >
                <td className="h-[72px] px-4 py-2 text-[#111518] dark:text-white text-sm">
                  {alert.productName}
                </td>
                <td className="h-[72px] px-4 py-2 text-gray-600 dark:text-gray-400 text-sm">
                  {alert.stock}
                </td>
                <td className="h-[72px] px-4 py-2 text-sm">
                  <span className="inline-flex items-center gap-1.5 whitespace-nowrap rounded-full bg-[#DC3545]/20 px-3 py-1 text-sm font-medium text-[#DC3545] dark:text-red-300">
                    <span className="size-2 rounded-full bg-[#DC3545]"></span>
                    Crítico
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default AlertsTable;