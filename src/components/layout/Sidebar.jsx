import React from 'react';
import { NavLink } from 'react-router-dom';

const navigationLinks = [
  { to: '/', name: 'Dashboard', icon: 'dashboard' },
  { to: '/productos', name: 'Productos', icon: 'inventory_2' },
  { to: '/ventas', name: 'Ventas', icon: 'shopping_cart' },
  { to: '/clientes', name: 'Clientes', icon: 'group' },
  { to: '/reportes', name: 'Reportes', icon: 'bar_chart' },
];

// Componente de enlace reutilizable
const SidebarLink = ({ to, name, icon, onClick }) => (
  <NavLink
    to={to}
    onClick={onClick} // Cierra el menú al hacer clic en móvil
    className={({ isActive }) =>
      `flex items-center gap-3 px-3 py-2 rounded-lg ${
        isActive
          ? 'bg-primary/20 text-primary dark:bg-primary/30' // Estilo activo (ahora será azul)
          : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800'
      }`
    }
  >
    <span className="material-symbols-outlined">{icon}</span>
    <p className="text-sm font-medium">{name}</p>
  </NavLink>
);

// El Sidebar ahora es un componente "tonto" que recibe props
const Sidebar = ({ isMobileMenu, onClose }) => {
  return (
    <div className="flex flex-col h-full justify-between">
      <div className="flex flex-col gap-4">
        
        <header className="flex items-center justify-between">
          <div className="flex gap-3 items-center">
            <div className="bg-primary text-white p-2 rounded-lg size-10 flex items-center justify-center">
              <span className="material-symbols-outlined">egg</span>
            </div>
            <div className="flex flex-col">
              <h1 className="text-gray-900 dark:text-white text-base font-medium">
                Gestor
              </h1>
              <p className="text-gray-500 dark:text-gray-400 text-sm">
                Emprendimiento
              </p>
            </div>
          </div>
          {/* Muestra el botón de cerrar SÓLO si es el menú móvil */}
          {isMobileMenu && (
            <button onClick={onClose} className="text-gray-400 lg:hidden">
              <span className="material-symbols-outlined">close</span>
            </button>
          )}
        </header>

        <nav className="flex flex-col gap-2 mt-4">
          {navigationLinks.map((link) => (
            <SidebarLink
              key={link.name}
              to={link.to}
              name={link.name}
              icon={link.icon}
              // Si estamos en móvil, el 'onClose' se pasa al enlace
              onClick={isMobileMenu ? onClose : undefined} 
            />
          ))}
        </nav>
      </div>
    </div>
  );
};

export default Sidebar;