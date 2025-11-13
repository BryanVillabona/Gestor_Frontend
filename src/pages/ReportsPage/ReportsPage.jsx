import React from 'react';
// 1. Importamos nuestro componente de reporte
import DateRangeReport from './components/DateRangeReport';

const ReportsPage = () => {
  return (
    // HTML del Mockup
    <section>
      <header className="mb-8">
        <h1 className="text-gray-900 dark:text-white text-4xl font-black leading-tight tracking-[-0.033em]">
          Análisis de Ventas
        </h1>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Columna principal con nuestro componente */}
        <main className="lg:col-span-2 flex flex-col gap-8">
          <DateRangeReport />
        </main>

        {/* Columna secundaria (la dejamos estática por ahora, como en el mockup) */}
        <aside className="lg:col-span-1 flex flex-col gap-8">
          <article className="bg-white dark:bg-gray-900/50 p-6 rounded-xl border ...">
            <h2 className="text-gray-900 dark:text-white text-lg font-bold mb-4">Top 5 Clientes</h2>
            <p className="text-sm text-gray-500">(Este reporte aún no está conectado)</p>
          </article>
          <article className="bg-white dark:bg-gray-900/50 p-6 rounded-xl border ...">
            <h2 className="text-gray-900 dark:text-white text-lg font-bold mb-4">Top 5 Productos</h2>
             <p className="text-sm text-gray-500">(Los datos saldrán del reporte principal)</p>
          </article>
        </aside>
      </div>
    </section>
  );
};

export default ReportsPage;