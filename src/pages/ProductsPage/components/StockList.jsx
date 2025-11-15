import React, { useState, useEffect } from 'react';
import { toast } from 'react-hot-toast';
// 1. Importamos todo lo necesario
import { getInventory, addStock, updateStock } from '../../../services/inventory.service';
import { getProducts } from '../../../services/products.service';
import Modal from '../../../components/ui/Modal';
import StockForm from './StockForm';
import StockEditForm from './StockEditForm';

const StockList = () => {
    const [inventory, setInventory] = useState([]);
    const [products, setProducts] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [modalMode, setModalMode] = useState('add'); // 'add' o 'edit'
    const [selectedItem, setSelectedItem] = useState(null);

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
    const handleOpenModal = (mode = 'add', item = null) => {
        setModalMode(mode);
        setSelectedItem(item);
        setIsModalOpen(true);
    };
    const handleCloseModal = () => {
        setIsModalOpen(false);
        setSelectedItem(null);
        setModalMode('add');
    };

    // 5. Función para manejar el guardado de stock
    const handleAddStock = async (stockData) => {
        try {
            await addStock(stockData);
            fetchInventory();
            handleCloseModal();
            toast.success('Entrada registrada');
        } catch (error) {
            toast.error(`Error: ${error.message}`);
        }
    };

    const handleUpdateStock = async (newQuantity) => {
        if (!selectedItem) return;
        try {
            // selectedItem._id es el ID del Inventario
            await updateStock(selectedItem._id, newQuantity);
            fetchInventory();
            handleCloseModal();
            toast.success('Stock corregido exitosamente');
        } catch (error) {
            toast.error(`Error: ${error.message}`);
        }
    };

    if (isLoading && !isModalOpen) {
        return <p>Cargando inventario...</p>;
    }

    return (
        <section>
            <div className="flex flex-wrap justify-between items-center gap-4 pt-4">
                <h3 className="text-[#111518] dark:text-white text-lg font-bold">
                    Estado del Inventario
                </h3>
                <div className="py-3">
                    {/* Botón Registrar Entrada (Modo 'add') */}
                    <button
                        onClick={() => handleOpenModal('add')}
                        className="flex min-w-[84px] cursor-pointer items-center justify-center rounded-lg h-10 px-4 bg-verde-stock text-white gap-2 pl-4 text-sm font-bold hover:bg-opacity-90"
                    >
                        <span className="material-symbols-outlined">add</span>
                        <span className="truncate">Registrar Entrada</span>
                    </button>
                </div>
            </div>

            <div className="px-4 py-3">
                <div className="flex overflow-hidden rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800">
                    <table className="flex-1">
                        <thead className="bg-gray-50 dark:bg-gray-900/50 border-b border-gray-200 dark:border-gray-700">
                            <tr>
                                <th className="px-4 py-3 text-left text-gray-900 dark:text-white text-sm font-medium">Nombre del Producto</th>
                                <th className="px-4 py-3 text-left text-gray-900 dark:text-white text-sm font-medium">Stock Actual</th>
                                {/* Nueva columna de acciones */}
                                <th className="px-4 py-3 text-right text-gray-900 dark:text-white text-sm font-medium">Acciones</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                            {inventory.length > 0 ? (
                                inventory.map((item) => (
                                    <tr key={item._id}>
                                        <td className="h-[72px] px-4 py-2 text-gray-900 dark:text-gray-200 text-sm">
                                            {item.productId?.name || 'Producto no encontrado'}
                                        </td>
                                        <td className="h-[72px] px-4 py-2 text-gray-900 dark:text-gray-200 text-sm">
                                            {item.currentStock} unidades
                                        </td>
                                        {/* Botón Editar */}
                                        <td className="h-[72px] px-4 py-2 text-right">
                                            <button
                                                onClick={() => handleOpenModal('edit', item)}
                                                className="text-primary hover:text-primary/80"
                                                title="Corregir Stock"
                                            >
                                                <span className="material-symbols-outlined">edit</span>
                                            </button>
                                        </td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan="3" className="h-[72px] px-4 py-2 text-center text-gray-500">
                                        No hay inventario.
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Modal Dinámico */}
            <Modal
                isOpen={isModalOpen}
                onClose={handleCloseModal}
                title={modalMode === 'add' ? "Registrar Entrada" : "Corregir Stock"}
            >
                {modalMode === 'add' ? (
                    <StockForm
                        products={products}
                        onSubmit={handleAddStock}
                        onCancel={handleCloseModal}
                    />
                ) : (
                    <StockEditForm
                        inventoryItem={selectedItem}
                        onSubmit={handleUpdateStock}
                        onCancel={handleCloseModal}
                    />
                )}
            </Modal>
        </section>
    );
};

export default StockList;