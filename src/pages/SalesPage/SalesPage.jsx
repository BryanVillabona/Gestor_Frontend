import React, { useState } from 'react';
// 1. Importamos los dos componentes de las pestañas
import NewSaleForm from './components/NewSaleForm';
import SalesHistory from './components/SalesHistory';

const SalesPage = () => {
  // 2. Estado para saber qué pestaña está activa
  const [activeTab, setActiveTab] = useState('new'); // 'new' o 'history'

  // 3. Tomamos el HTML del mockup y le agregamos lógica de React
  return (
    // HTML Semántico: <section> para la página
    <section>
      {/* Encabezado de la página del mockup */}
      <header className="flex flex-wrap justify-between gap-4">
        <div className="flex min-w-72 flex-col gap-2">
          <h1 className="text-gray-900 dark:text-white text-3xl md:text-4xl font-black tracking-[-0.033em]">
            Gestión de Ventas
          </h1>
          <p className="text-gray-500 dark:text-gray-400 text-base font-normal">
            Crea nuevas ventas y consulta el historial completo.
          </p>
        </div>
      </header>

      {/* Pestañas del mockup */}
      <nav className="mt-8">
        <div className="flex border-b border-gray-200 dark:border-gray-700 gap-8">
          {/* Botón de Pestaña "Nueva Venta" */}
          <button
            onClick={() => setActiveTab('new')}
            className={`flex flex-col items-center justify-center border-b-[3px] pb-3 pt-2 ${
              activeTab === 'new'
                ? 'border-b-primary text-primary'
                : 'border-b-transparent text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200'
            }`}
          >
            <p className="text-sm font-bold tracking-wide">Nueva Venta</p>
          </button>

          {/* Botón de Pestaña "Historial de Ventas" */}
          <button
            onClick={() => setActiveTab('history')}
            className={`flex flex-col items-center justify-center border-b-[3px] pb-3 pt-2 ${
              activeTab === 'history'
                ? 'border-b-primary text-primary'
                : 'border-b-transparent text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200'
            }`}
          >
            <p className="text-sm font-bold tracking-wide">Historial de Ventas</p>
          </button>
        </div>
      </nav>

      {/* Contenido Condicional de la Pestaña */}
      <main>
        {activeTab === 'new' ? <NewSaleForm /> : <SalesHistory />}
      </main>
    </section>
  );
};

export default SalesPage;