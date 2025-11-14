import React from 'react';
// Importamos AMBOS reportes
import DateRangeReport from './components/DateRangeReport';
import DebtorCustomersReport from './components/DebtorCustomersReport'; // <-- AÑADIR ESTO

const ReportsPage = () => {
  return (
    <section>
      <header className="mb-8">
        <h1 className="text-gray-900 dark:text-white text-4xl font-black leading-tight tracking-[-0.033em]">
          Análisis y Reportes
        </h1>
      </header>

      {/* --- ESTRUCTURA MODIFICADA --- */}
      {/* Ahora ambos reportes están en la columna principal */}
      <div className="flex flex-col gap-8">
        
        {/* Reporte de Ventas por Rango (el que ya tenías) */}
        <DateRangeReport />

        {/* Reporte de Deudores (el nuevo) */}
        <DebtorCustomersReport />

      </div>
      {/* --- FIN ESTRUCTURA MODIFICADA --- */}
      
    </section>
  );
};

export default ReportsPage;