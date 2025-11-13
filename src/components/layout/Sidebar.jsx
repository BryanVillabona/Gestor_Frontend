import React from 'react';
// 1. Importamos NavLink para la navegación
import { NavLink } from 'react-router-dom';

// 2. Definimos los enlaces de nuestra app
// (Tenerlos en un array es más fácil de mantener)
const navigationLinks = [
    { to: '/', name: 'Dashboard', icon: 'dashboard' },
    { to: '/productos', name: 'Productos', icon: 'inventory_2' },
    { to: '/ventas', name: 'Ventas', icon: 'shopping_cart' },
    { to: '/clientes', name: 'Clientes', icon: 'group' },
    { to: '/reportes', name: 'Reportes', icon: 'bar_chart' },
];

// Componente de enlace reutilizable
const SidebarLink = ({ to, name, icon }) => (
    <NavLink
        to={to}
        // Esto aplica clases condicionales. Tailwind usa 'dark:' para modo oscuro.
        // 'isActive' nos lo da NavLink automáticamente
        className={({ isActive }) =>
            `flex items-center gap-3 px-3 py-2 rounded-lg ${isActive
                ? 'bg-primary/20 text-primary dark:bg-primary/30' // Estilo activo
                : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800' // Estilo inactivo
            }`
        }
    >
        <span className="material-symbols-outlined">{icon}</span>
        <p className="text-sm font-medium">{name}</p>
    </NavLink>
);

// Componente principal de la Sidebar
const Sidebar = () => {
    return (
        // HTML Semántico: <aside> para la barra lateral
        <aside className="w-64 flex-shrink-0 bg-white dark:bg-gray-900/50 p-4 border-r border-gray-200 dark:border-gray-800 flex flex-col">      <div className="flex flex-col h-full justify-between">
            <div className="flex flex-col gap-4">

                {/* Encabezado del Sidebar (Logo y Nombre) */}
                <header className="flex gap-3 items-center">
                    {/* Puedes reemplazar este div con tu logo */}
                    <div className="bg-primary text-gray-800 p-2 rounded-lg size-10 flex items-center justify-center">
                        <span className="material-symbols-outlined">egg</span>
                    </div>
                    <div className="flex flex-col">
                        <h1 className="text-gray-900 dark:text-white text-base font-medium leading-normal">
                            Gestor de
                        </h1>
                        <p className="text-gray-500 dark:text-gray-400 text-sm font-normal leading-normal">
                            Emprendimiento
                        </p>
                    </div>
                </header>

                {/* HTML Semántico: <nav> para la navegación */}
                <nav className="flex flex-col gap-2 mt-4">
                    {navigationLinks.map((link) => (
                        <SidebarLink
                            key={link.name}
                            to={link.to}
                            name={link.name}
                            icon={link.icon}
                        />
                    ))}
                </nav>
            </div>
        </div>
        </aside>
    );
};

export default Sidebar;