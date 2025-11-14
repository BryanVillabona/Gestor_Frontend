import React, { useState } from 'react';
import { toast } from 'react-hot-toast';

const StockForm = ({ products, onSubmit, onCancel }) => {
  // Estado para los campos del formulario
  const [productId, setProductId] = useState(products[0]?._id || ''); // Selecciona el primer producto por defecto
  const [quantity, setQuantity] = useState('');

  // Manejador para enviar el formulario
  const handleSubmit = (e) => {
    e.preventDefault();
    if (!productId || !quantity) {
      toast.error('Por favor, selecciona un producto y una cantidad.');
      return;
    }
    onSubmit({
      productId: productId,
      quantity: Number(quantity),
    });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Campo Producto (Dropdown) */}
      <label className="flex flex-col w-full">
        <span className="text-gray-800 dark:text-gray-200 text-sm font-medium pb-2">
          Producto
        </span>
        <select
          name="productId"
          value={productId}
          onChange={(e) => setProductId(e.target.value)}
          required
          className="form-select flex w-full min-w-0 flex-1 rounded-lg text-gray-900 dark:text-white focus:outline-0 focus:ring-2 focus:ring-primary/50 border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-900/50 h-12 px-3 text-base"
        >
          <option value="" disabled>Selecciona un producto...</option>
          {products.map((product) => (
            // Usamos el ID del producto como 'value'
            <option key={product._id} value={product._id}>
              {product.name}
            </option>
          ))}
        </select>
      </label>

      {/* Campo Cantidad */}
      <label className="flex flex-col w-full">
        <span className="text-gray-800 dark:text-gray-200 text-sm font-medium pb-2">
          Cantidad a Añadir
        </span>
        <input
          name="quantity"
          type="number"
          value={quantity}
          onChange={(e) => setQuantity(e.target.value)}
          required
          min="1"
          placeholder="Ej: 50"
          className="form-input flex w-full min-w-0 flex-1 rounded-lg text-gray-900 dark:text-white focus:outline-0 focus:ring-2 focus:ring-primary/50 border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-900/50 h-12 placeholder:text-gray-400 px-3 text-base"
        />
      </label>

      {/* Botones de Acción */}
      <footer className="flex justify-end gap-4 pt-4">
        <button
          type="button"
          onClick={onCancel}
          className="flex min-w-[84px] cursor-pointer items-center justify-center rounded-lg h-10 px-4 bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-200 text-sm font-bold"
        >
          Cancelar
        </button>
        <button
          type="submit"
          className="flex min-w-[84px] cursor-pointer items-center justify-center rounded-lg h-10 px-4 bg-[#28A745] text-white text-sm font-bold"
        >
          Guardar Entrada
        </button>
      </footer>
    </form>
  );
};

export default StockForm;