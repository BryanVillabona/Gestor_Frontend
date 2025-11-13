import React from 'react';
import { Routes, Route } from 'react-router-dom';
import MainLayout from '../components/layout/MainLayout';
import DashboardPage from '../pages/DashboardPage/DashboardPage';
import ProductsPage from '../pages/ProductsPage/ProductsPage';
import SalesPage from '../pages/SalesPage/SalesPage';
import CustomersPage from '../pages/CustomersPage/CustomersPage';
import ReportsPage from '../pages/ReportsPage/ReportsPage';

const AppRouter = () => {
  return (
    <Routes>
      <Route path="/" element={<MainLayout />}>
        <Route index element={<DashboardPage />} />
        <Route path="productos" element={<ProductsPage />} />
        <Route path="ventas" element={<SalesPage />} />
        <Route path="clientes" element={<CustomersPage />} />
        <Route path="reportes" element={<ReportsPage />} />
        <Route path="*" element={<h1>404: Página no encontrada</h1>} />
      </Route>
    </Routes>
  );
};

export default AppRouter;