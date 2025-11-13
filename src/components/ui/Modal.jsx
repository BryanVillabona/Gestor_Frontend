import React from 'react';

/**
 * Un componente de Modal genérico.
 * @param {boolean} isOpen - Controla si el modal está visible.
 * @param {function} onClose - Función que se llama al cerrar el modal (clic en fondo o 'x').
 * @param {string} title - El título que se mostrará en el modal.
 * @param {React.ReactNode} children - El contenido del modal (ej. un formulario).
 */
const Modal = ({ isOpen, onClose, title, children }) => {
  // Si no está abierto, no renderiza nada
  if (!isOpen) return null;

  // HTML Semántico: <dialog> para un modal
  return (
    // Fondo oscuro semi-transparente
    <div
      onClick={onClose} // Cierra el modal al hacer clic en el fondo
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4"
    >
      <dialog
        open // El <dialog> está abierto
        onClick={(e) => e.stopPropagation()} // Evita que el clic en el modal cierre el modal
        className="relative w-full max-w-2xl rounded-xl bg-white dark:bg-gray-800 shadow-lg"
      >
        {/* Encabezado del Modal */}
        <header className="flex items-center justify-between border-b border-gray-200 dark:border-gray-700 p-4 sm:p-6">
          <h2 className="text-lg font-bold text-gray-900 dark:text-white">
            {title}
          </h2>
          <button
            onClick={onClose} // Botón 'x' para cerrar
            className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
          >
            <span className="material-symbols-outlined">close</span>
          </button>
        </header>
        
        {/* Contenido del Modal (aquí irá nuestro formulario) */}
        <div className="p-4 sm:p-6">
          {children}
        </div>
      </dialog>
    </div>
  );
};

export default Modal;