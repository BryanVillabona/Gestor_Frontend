import React, { useState } from 'react';
// 1. Importamos los dos componentes de las pestañas
import ProductList from './components/ProductList';
import StockList from './components/StockList';

const ProductsPage = () => {
  // 2. Estado para saber qué pestaña está activa
  const [activeTab, setActiveTab] = useState('productos'); // 'productos' o 'stock'

  // 3. Tomamos el HTML del mockup y le agregamos lógica de React
  return (
    // HTML Semántico: <section> para la página
    <section>
      {/* Encabezado de la página del mockup */}
      <header className="flex flex-wrap justify-between items-center gap-4">
        <h1 className="text-[#111518] dark:text-white text-4xl font-black leading-tight tracking-[-0.033em] min-w-72">
          Gestión de Inventario
        </h1>
      </header>

      {/* Pestañas del mockup */}
      <nav className="pb-3 px-4 mt-8">
        <div className="flex border-b border-[#dbe1e6] dark:border-gray-700 gap-8">
          
          {/* Botón de Pestaña "Mis Productos" */}
          <button
            onClick={() => setActiveTab('productos')}
            className={`flex flex-col items-center justify-center border-b-[3px] pb-[13px] pt-4 ${
              activeTab === 'productos'
                ? 'border-b-primary text-[#111518] dark:text-white'
                : 'border-b-transparent text-[#617989] dark:text-gray-400'
            }`}
          >
            <p className="text-sm font-bold leading-normal tracking-[0.015em]">
              Mis Productos
            </p>
          </button>
          
          {/* Botón de Pestaña "Control de Stock" */}
          <button
            onClick={() => setActiveTab('stock')}
            className={`flex flex-col items-center justify-center border-b-[3px] pb-[13px] pt-4 ${
              activeTab === 'stock'
                ? 'border-b-primary text-[#111518] dark:text-white'
                : 'border-b-transparent text-[#617989] dark:text-gray-400'
            }`}
          >
            <p className="text-sm font-bold leading-normal tracking-[0.015em]">
              Control de Stock
            </p>
          </button>
        </div>
      </nav>

      {/* Contenido Condicional de la Pestaña */}
      <main>
        {activeTab === 'productos' ? <ProductList /> : <StockList />}
      </main>
    </section>
  );
};

export default ProductsPage;