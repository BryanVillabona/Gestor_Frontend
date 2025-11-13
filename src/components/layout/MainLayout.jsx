import React from 'react';
// 1. Importamos Outlet
import { Outlet } from 'react-router-dom';
import Sidebar from './Sidebar';

const MainLayout = () => {
  return (
    <div className="relative flex min-h-screen w-full flex-row group/design-root bg-background-light dark:bg-background-dark">
      {/* 1. Nuestro Sidebar fijo */}
      <Sidebar />

      {/* 2. El contenido principal (HTML Semántico: <main>) */}
      {/* Outlet renderizará aquí la página que corresponda a la ruta */}
      <main className="flex-1 p-6 lg:p-10">
        <Outlet />
      </main>
    </div>
  );
};

export default MainLayout;