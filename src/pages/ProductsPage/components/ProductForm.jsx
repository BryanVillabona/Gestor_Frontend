import React, { useState } from 'react';

const ProductForm = ({ product, onSubmit, onCancel }) => {
  // Estado para los campos del formulario
  const [formData, setFormData] = useState(() => {
    if (product) {
      // Estamos editando
      return {
        name: product.name,
        unitPrice: product.unitPrice,
        description: product.description || '',
      };
    } else {
      // Estamos creando
      return { name: '', unitPrice: '', description: '' };
    }
  });

  // Manejador para actualizar el estado cuando se escribe en un input
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // Manejador para enviar el formulario
  const handleSubmit = (e) => {
    e.preventDefault(); // Evita que la página se recargue
    // Convertimos unitPrice a número antes de enviar
    onSubmit({ ...formData, unitPrice: Number(formData.unitPrice) });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Campo Nombre */}
      <label className="flex flex-col w-full">
        <span className="text-gray-800 dark:text-gray-200 text-sm font-medium pb-2">
          Nombre del Producto
        </span>
        <input
          name="name"
          type="text"
          value={formData.name}
          onChange={handleChange}
          required
          placeholder="Ej: Huevos AA"
          className="form-input flex w-full min-w-0 flex-1 rounded-lg text-gray-900 dark:text-white focus:outline-0 focus:ring-2 focus:ring-primary/50 border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-900/50 h-12 placeholder:text-gray-400 px-3 text-base"
        />
      </label>

      {/* Campo Precio Unitario */}
      <label className="flex flex-col w-full">
        <span className="text-gray-800 dark:text-gray-200 text-sm font-medium pb-2">
          Precio Unitario
        </span>
        <input
          name="unitPrice"
          type="number"
          value={formData.unitPrice}
          onChange={handleChange}
          required
          min="0"
          placeholder="Ej: 500"
          className="form-input flex w-full min-w-0 flex-1 rounded-lg text-gray-900 dark:text-white focus:outline-0 focus:ring-2 focus:ring-primary/50 border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-900/50 h-12 placeholder:text-gray-400 px-3 text-base"
        />
      </label>

      {/* Campo Descripción */}
      <label className="flex flex-col w-full">
        <span className="text-gray-800 dark:text-gray-200 text-sm font-medium pb-2">
          Descripción (Opcional)
        </span>
        <textarea
          name="description"
          value={formData.description}
          onChange={handleChange}
          placeholder="Ej: Cubeta de 30 huevos"
          className="form-textarea flex w-full min-w-0 flex-1 rounded-lg text-gray-900 dark:text-white focus:outline-0 focus:ring-2 focus:ring-primary/50 border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-900/50 placeholder:text-gray-400 px-3 py-2 text-base"
          rows="3"
        ></textarea>
      </label>

      {/* Botones de Acción */}
      <footer className="flex justify-end gap-4 pt-4">
        <button
          type="button" // Importante: type="button" para que no envíe el formulario
          onClick={onCancel}
          className="flex min-w-[84px] cursor-pointer items-center justify-center rounded-lg h-10 px-4 bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-200 text-sm font-bold"
        >
          Cancelar
        </button>
        <button
          type="submit"
          className="flex min-w-[84px] cursor-pointer items-center justify-center rounded-lg h-10 px-4 bg-primary text-white text-sm font-bold transition-colors hover:bg-primary/90"
        >
          Guardar
        </button>
      </footer>
    </form>
  );
};

export default ProductForm;