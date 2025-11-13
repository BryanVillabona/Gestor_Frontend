import React, { useState, useEffect } from 'react';
// 1. Importamos todo lo que necesitamos
import { 
  getProducts, 
  createProduct, 
  updateProduct, 
  deleteProduct 
} from '../../../services/products.service';
import Modal from '../../../components/ui/Modal';
import ProductForm from './ProductForm';

// Formateador de moneda
const currencyFormatter = new Intl.NumberFormat('es-CO', {
  style: 'currency',
  currency: 'COP',
  maximumFractionDigits: 0,
});

const ProductList = () => {
  const [products, setProducts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  
  // 2. Estados para manejar el Modal y la edición
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null); // null = Crear, objeto = Editar

  // 3. Función para cargar (o recargar) los productos
  const fetchProducts = async () => {
    try {
      setIsLoading(true);
      const data = await getProducts();
      setProducts(data);
    } catch (error) {
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  // Carga inicial de productos
  useEffect(() => {
    fetchProducts();
  }, []);

  // 4. Funciones para abrir/cerrar el modal
  const handleOpenModal = (product = null) => {
    setSelectedProduct(product); // Si es null, es 'crear'. Si tiene producto, es 'editar'.
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedProduct(null); // Limpiamos el producto seleccionado
  };

  // 5. Función para manejar el guardado (Crear o Editar)
  const handleSaveProduct = async (productData) => {
    try {
      if (selectedProduct) {
        // Estamos editando
        await updateProduct(selectedProduct._id, productData);
      } else {
        // Estamos creando
        await createProduct(productData);
      }
      fetchProducts(); // Recargamos la lista de productos
      handleCloseModal(); // Cerramos el modal
    } catch (error) {
      console.error('Error al guardar producto:', error);
      alert(`Error: ${error.message || 'No se pudo guardar el producto'}`);
    }
  };

  // 6. Función para manejar la eliminación
  const handleDeleteProduct = async (productId) => {
    // Pedimos confirmación
    if (window.confirm('¿Estás seguro de que quieres eliminar este producto? Esta acción no se puede deshacer.')) {
      try {
        await deleteProduct(productId);
        fetchProducts(); // Recargamos la lista
      } catch (error) {
        console.error('Error al eliminar producto:', error);
        alert(`Error: ${error.message || 'No se pudo eliminar el producto'}`);
      }
    }
  };


  if (isLoading && !isModalOpen) { // No mostramos "cargando" si el modal está abierto
    return <p>Cargando productos...</p>;
  }

  return (
    <section>
      {/* Encabezado y Botón "Crear" */}
      <div className="flex flex-wrap justify-between items-center gap-4 pt-4">
        <h3 className="text-[#111518] dark:text-white text-lg font-bold ...">
          Listado de Productos
        </h3>
        <div className="py-3">
          {/* 7. Conectamos el botón "Crear" */}
          <button
            onClick={() => handleOpenModal(null)} // null = modo "Crear"
            className="flex min-w-[84px] ... cursor-pointer ...">
            <span className="material-symbols-outlined text-gray-800">add</span>
            <span className="truncate">Crear Nuevo Producto</span>
          </button>
        </div>
      </div>

      {/* Tabla de Productos */}
      <div className="px-4 py-3">
        <div className="flex overflow-hidden ... bg-white ...">
          <table className="flex-1">
            <thead>
              <tr className="bg-white ...">
                {/* ... (encabezados de tabla th) ... */}
                <th className="px-4 py-3 text-left text-[#111518] dark:text-gray-300 w-[25%] text-sm font-medium">Nombre</th>
                <th className="px-4 py-3 text-left text-[#111518] dark:text-gray-300 w-[15%] text-sm font-medium">Precio Unitario</th>
                <th className="px-4 py-3 text-left text-[#111518] dark:text-gray-300 w-[40%] text-sm font-medium">Descripción</th>
                <th className="px-4 py-3 text-left text-[#111518] dark:text-gray-300 w-[20%] text-sm font-medium">Acciones</th>
              </tr>
            </thead>
            <tbody>
              {products.length > 0 ? (
                products.map((product) => (
                  <tr 
                    key={product._id} 
                    className="border-t ...">
                    <td className="h-[72px] px-4 py-2 ...">
                      {product.name}
                    </td>
                    <td className="h-[72px] px-4 py-2 ...">
                      {currencyFormatter.format(product.unitPrice)}
                    </td>
                    <td className="h-[72px] px-4 py-2 ...">
                      {product.description || 'N/A'}
                    </td>
                    <td className="h-[72px] px-4 py-2 ...">
                      <div className="flex items-center gap-4">
                        {/* 8. Conectamos el botón "Editar" */}
                        <button
                          onClick={() => handleOpenModal(product)} // product = modo "Editar"
                          className="flex items-center gap-1 ...">
                          <span className="material-symbols-outlined text-base">edit</span>
                          <span className="font-bold text-sm">Editar</span>
                        </button>
                        {/* 9. Conectamos el botón "Eliminar" */}
                        <button
                          onClick={() => handleDeleteProduct(product._id)}
                          className="flex items-center gap-1 ...">
                          <span className="material-symbols-outlined text-base">delete</span>
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="4" className="h-[72px] px-4 py-2 text-center ...">
                    Aún no tienes productos. ¡Crea el primero!
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* 10. El Modal para Crear/Editar */}
      <Modal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        title={selectedProduct ? 'Editar Producto' : 'Crear Nuevo Producto'}
      >
        <ProductForm
          key={selectedProduct ? selectedProduct._id : 'new'} 
          
          product={selectedProduct}
          onSubmit={handleSaveProduct}
          onCancel={handleCloseModal}
        />
      </Modal>
    </section>
  );
};

export default ProductList;