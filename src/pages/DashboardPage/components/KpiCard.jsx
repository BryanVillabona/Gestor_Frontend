import React from 'react';

// Reutilizamos el 'icon' que pasamos para cambiar el ícono
const KpiCard = ({ title, value, icon }) => {
  // Formateador para moneda (opcional, pero se ve bien)
  const formattedValue = new Intl.NumberFormat('es-CO', {
    style: 'currency',
    currency: 'COP',
    maximumFractionDigits: 0,
  }).format(value);

  return (
    <article className="flex min-w-[158px] flex-1 flex-col gap-4 rounded-xl p-6 border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800/50 shadow-sm">
      <div className="flex items-center gap-3">
        <div className="bg-primary/20 text-primary rounded-lg p-2">
          <span className="material-symbols-outlined">{icon}</span>
        </div>
        <p className="text-[#111518] dark:text-white text-base font-medium leading-normal">
          {title}
        </p>
      </div>
      <p className="text-[#111518] dark:text-white tracking-light text-3xl font-bold leading-tight">
        {formattedValue}
      </p>
    </article>
  );
};

export default KpiCard;