import React from 'react';

// Este Header SÓLO se mostrará en móviles (lg:hidden)
const Header = ({ onMenuClick }) => {
  return (
    // HTML Semántico <header>
    <header className="sticky top-0 z-10 flex h-16 w-full items-center justify-between bg-white px-4 shadow-sm dark:bg-gray-900 lg:hidden">
      <div className="flex items-center gap-3">
        <div className="bg-primary text-white p-2 rounded-lg size-8 flex items-center justify-center">
          <span className="material-symbols-outlined text-base">egg</span>
        </div>
        <h1 className="text-gray-900 dark:text-white text-base font-medium">
          Gestor
        </h1>
      </div>
      <button
        onClick={onMenuClick}
        className="text-gray-700 dark:text-gray-300"
        aria-label="Abrir menú"
      >
        <span className="material-symbols-outlined">menu</span>
      </button>
    </header>
  );
};

export default Header;