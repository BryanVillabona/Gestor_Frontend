import React, { useState } from 'react';

const StockEditForm = ({ inventoryItem, onSubmit, onCancel }) => {
  // Inicializamos con el valor actual
  const [quantity, setQuantity] = useState(inventoryItem?.currentStock || 0);

  const handleSubmit = (e) => {
    e.preventDefault();
    // Enviamos solo el número
    onSubmit(Number(quantity));
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="bg-yellow-50 dark:bg-yellow-900/20 p-4 rounded-lg border border-yellow-200 dark:border-yellow-700">
        <p className="text-sm text-yellow-800 dark:text-yellow-200">
          <span className="font-bold">Advertencia:</span> Estás a punto de corregir manualmente el stock de 
          <span className="font-bold"> {inventoryItem?.productId?.name}</span>. 
          Esto sobrescribirá el valor actual.
        </p>
      </div>

      <label className="flex flex-col w-full">
        <span className="text-gray-800 dark:text-gray-200 text-sm font-medium pb-2">
          Nuevo Stock Real
        </span>
        <input
          type="number"
          value={quantity}
          onChange={(e) => setQuantity(e.target.value)}
          required
          min="0"
          className="form-input flex w-full rounded-lg border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-900/50 h-12 px-3"
        />
      </label>

      <footer className="flex justify-end gap-4 pt-4">
        <button
          type="button"
          onClick={onCancel}
          className="px-4 h-10 rounded-lg bg-gray-200 dark:bg-gray-700 text-sm font-bold text-gray-800 dark:text-white"
        >
          Cancelar
        </button>
        <button
          type="submit"
          className="px-4 h-10 rounded-lg bg-primary text-white text-sm font-bold hover:bg-primary/90"
        >
          Actualizar
        </button>
      </footer>
    </form>
  );
};

export default StockEditForm;