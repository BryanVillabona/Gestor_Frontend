import React, { useState, useEffect } from 'react';
// 1. Importamos todo lo necesario
import { getInventory, addStock } from '../../../services/inventory.service';
import { getProducts } from '../../../services/products.service'; // Para el dropdown
import Modal from '../../../components/ui/Modal';
import StockForm from './StockForm';

const StockList = () => {
  const [inventory, setInventory] = useState([]);
  const [products, setProducts] = useState([]); // Para el formulario
  const [isLoading, setIsLoading] = useState(true);

  // 2. Estado para el modal
  const [isModalOpen, setIsModalOpen] = useState(false);

  // 3. Función para cargar (o recargar) el inventario
  const fetchInventory = async () => {
    try {
      setIsLoading(true);
      const data = await getInventory();
      setInventory(data);
    } catch (error) {
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  // Carga inicial
  useEffect(() => {
    const loadData = async () => {
      try {
        setIsLoading(true);
        // Pedimos el inventario y la lista de productos en paralelo
        const [inventoryData, productsData] = await Promise.all([
          getInventory(),
          getProducts(), // Necesitamos la lista completa para el dropdown
        ]);
        setInventory(inventoryData);
        setProducts(productsData);
      } catch (error) {
        console.error('Error al cargar datos de inventario:', error);
      } finally {
        setIsLoading(false);
      }
    };
    loadData();
  }, []);

  // 4. Funciones para manejar el modal
  const handleOpenModal = () => setIsModalOpen(true);
  const handleCloseModal = () => setIsModalOpen(false);

  // 5. Función para manejar el guardado de stock
  const handleAddStock = async (stockData) => {
    try {
      await addStock(stockData);
      fetchInventory(); // Recargamos el inventario
      handleCloseModal(); // Cerramos el modal
    } catch (error) {
      console.error('Error al añadir stock:', error);
      alert(`Error: ${error.message || 'No se pudo añadir el stock'}`);
    }
  };

  if (isLoading && !isModalOpen) {
    return <p>Cargando inventario...</p>;
  }

  return (
    <section>
      {/* Encabezado y Botón "Registrar Entrada" */}
      <div className="flex flex-wrap justify-between items-center gap-4 pt-4">
        <h3 className="text-[#111518] dark:text-white text-lg font-bold ...">
          Estado del Inventario
        </h3>
        <div className="py-3">
          {/* 6. Conectamos el botón para abrir el modal */}
          <button
            onClick={handleOpenModal}
            className="flex min-w-[84px] ... cursor-pointer ... bg-[#28A745] text-white ..."
          >
            <span className="material-symbols-outlined">add</span>
            <span className="truncate">Registrar Entrada</span>
          </button>
        </div>
      </div>

      {/* Tabla de Stock */}
      <div className="px-4 py-3">
        <div className="flex overflow-hidden ... bg-white ...">
          <table className="flex-1">
            <thead>
              <tr className="bg-white ...">
                {/* ... (encabezados de tabla th) ... */}
                <th className="px-4 py-3 text-left ... w-[60%] ...">Nombre del Producto</th>
                <th className="px-4 py-3 text-left ... w-[40%] ...">Stock Actual</th>
              </tr>
            </thead>
            <tbody>
              {inventory.length > 0 ? (
                inventory.map((item) => (
                  <tr key={item._id} className="border-t ...">
                    <td className="h-[72px] px-4 py-2 ...">
                      {item.productId?.name || 'Producto no encontrado'}
                    </td>
                    <td className="h-[72px] px-4 py-2 ...">
                      {item.currentStock} unidades
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="2" className="h-[72px] px-4 py-2 text-center ...">
                    No hay inventario para mostrar.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* 7. El Modal para Registrar Entrada */}
      <Modal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        title="Registrar Entrada de Inventario"
      >
        <StockForm
          // Pasamos la lista de productos al formulario
          products={products}
          onSubmit={handleAddStock}
          onCancel={handleCloseModal}
        />
      </Modal>
    </section>
  );
};

export default StockList;