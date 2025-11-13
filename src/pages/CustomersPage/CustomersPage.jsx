import React, { useState } from 'react';
// 1. Importamos los dos componentes de las pestañas
import CustomerList from './components/CustomerList';
import PortfolioManager from './components/PortfolioManager';

const CustomersPage = () => {
  // 2. Estado para saber qué pestaña está activa
  const [activeTab, setActiveTab] = useState('directory'); // 'directory' o 'portfolio'

  return (
    // HTML del Mockup
    <section>
      <header className="flex flex-wrap justify-between gap-4 p-4">
        <div className="flex min-w-72 flex-col gap-3">
          <h1 className="text-[#111518] dark:text-white text-4xl font-black">
            Gestión de Clientes y Deudas
          </h1>
          <p className="text-[#617989] dark:text-gray-400 text-base">
            Administra el directorio de tus clientes y lleva un control de la cartera.
          </p>
        </div>
      </header>
      
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm mt-6">
        {/* Pestañas del Mockup */}
        <nav className="pb-3">
          <div className="flex border-b border-[#dbe1e6] dark:border-[#232f3b] px-4 sm:px-6 gap-8">
            <button
              onClick={() => setActiveTab('directory')}
              className={`flex flex-col items-center justify-center border-b-[3px] pb-[13px] pt-4 ${
                activeTab === 'directory'
                  ? 'border-b-primary text-primary'
                  : 'border-b-transparent text-[#617989] dark:text-gray-400 hover:text-primary'
              }`}
            >
              <p className="text-sm font-bold">Directorio de Clientes</p>
            </button>
            <button
              onClick={() => setActiveTab('portfolio')}
              className={`flex flex-col items-center justify-center border-b-[3px] pb-[13px] pt-4 ${
                activeTab === 'portfolio'
                  ? 'border-b-primary text-primary'
                  : 'border-b-transparent text-[#617989] dark:text-gray-400 hover:text-primary'
              }`}
            >
              <p className="text-sm font-bold">Gestión de Cartera</p>
            </button>
          </div>
        </nav>

        {/* Contenido Condicional de la Pestaña */}
        <main>
          {activeTab === 'directory' ? <CustomerList /> : <PortfolioManager />}
        </main>
      </div>
    </section>
  );
};

export default CustomersPage;