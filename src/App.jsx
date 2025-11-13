import React from 'react';
import { Routes, Route } from 'react-router-dom';

// 1. Importamos nuestro Layout
import MainLayout from './components/layout/MainLayout';

// 2. Importamos las páginas que creamos
import DashboardPage from './pages/DashboardPage/DashboardPage';
import ProductsPage from './pages/ProductsPage/ProductsPage';
import SalesPage from './pages/SalesPage/SalesPage';
import CustomersPage from './pages/CustomersPage/CustomersPage';
import ReportsPage from './pages/ReportsPage/ReportsPage';

function App() {
  return (
    <Routes>
      {/* 3. Definimos una ruta "padre" que usa MainLayout */}
      <Route path="/" element={<MainLayout />}>
        {/* Estas rutas "hijas" se renderizarán dentro del <Outlet> de MainLayout */}
        <Route index element={<DashboardPage />} />
        <Route path="productos" element={<ProductsPage />} />
        <Route path="ventas" element={<SalesPage />} />
        <Route path="clientes" element={<CustomersPage />} />
        <Route path="reportes" element={<ReportsPage />} />
        
        {/* Ruta para "No Encontrado" */}
        <Route path="*" element={<h1>404: Página no encontrada</h1>} />
      </Route>
    </Routes>
  );
}

export default App;
