import React, { useState } from 'react';
import { Outlet } from 'react-router-dom';
import Sidebar from './Sidebar';
import Header from './Header'; // Importamos el nuevo Header
import { Toaster } from 'react-hot-toast';

const MainLayout = () => {
  // Estado para controlar el menú móvil
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  return (
    // El fondo se aplica aquí
    <div className="relative flex min-h-screen w-full flex-row bg-background-light dark:bg-background-dark">
      {/* Sidebar Fijo (Solo para Desktop) */}
      {/* Usamos las clases originales de Stitch: hidden en móvil, flex en desktop */}
      <aside className="w-64 flex-shrink-0 bg-white dark:bg-gray-900/50 p-4 border-r border-gray-200 dark:border-gray-800 hidden lg:flex flex-col">
        {/* Pasamos 'false' porque este no es el menú móvil */}
        <Sidebar isMobileMenu={false} />
      </aside>

      {/* Sidebar Móvil (Tipo Cajón/Drawer) */}
      {/* Este usa las clases de Tailwind para transición y aparecer/desaparecer */}
      <div
        className={`fixed inset-0 z-50 transform transition-transform duration-300 ease-in-out lg:hidden ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'
          }`}
      >
        <aside className="w-64 h-full bg-white dark:bg-gray-900 p-4 border-r border-gray-200 dark:border-gray-800 flex flex-col">
          <Sidebar
            isMobileMenu={true}
            onClose={() => setIsSidebarOpen(false)}
          />
        </aside>
        {/* Fondo oscuro para cerrar al hacer clic */}
        <div
          className="flex-1 h-full bg-black/50"
          onClick={() => setIsSidebarOpen(false)}
        ></div>
      </div>

      {/* Contenido Principal */}
      <div className="flex-1 flex flex-col">
        {/* Header (Solo para Móvil) */}
        <Header onMenuClick={() => setIsSidebarOpen(true)} />

        {/* HTML Semántico <main> para el contenido */}
        <main className="flex-1 p-6 lg:p-10">
          <Outlet />
        </main>
      </div>

      {/* 2. Añadir el Toaster aquí. Se superpondrá a todo. */}
      <Toaster position="top-right" reverseOrder={false} />

    </div>
  );
};

export default MainLayout;