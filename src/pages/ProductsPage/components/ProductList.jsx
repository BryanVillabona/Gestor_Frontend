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
import { toast } from 'react-hot-toast'; // Importamos toast

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

    // 3. ¡CORRECCIÓN! Faltaba este estado para el modal de borrado
    const [productToDelete, setProductToDelete] = useState(null);

    // 4. Función para cargar (o recargar) los productos
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

    // 5. Funciones para abrir/cerrar el modal de CREAR/EDITAR
    const handleOpenModal = (product = null) => {
        setSelectedProduct(product);
        setIsModalOpen(true);
    };

    const handleCloseModal = () => {
        setIsModalOpen(false);
        setSelectedProduct(null);
    };

    // 6. Función para manejar el guardado (Crear o Editar)
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
            
            // ¡CORRECCIÓN! Añadimos el toast de éxito
            toast.success(selectedProduct ? 'Producto actualizado' : 'Producto creado');
            
        } catch (error) {
            console.error('Error al guardar producto:', error);
            // Usamos toast de error
            toast.error(`Error: ${error.message || 'No se pudo guardar el producto'}`);
        }
    };

    // 7. Función para manejar la eliminación (se llama desde el modal)
    const handleConfirmDelete = async () => {
        if (!productToDelete) return;

        try {
            await deleteProduct(productToDelete._id);
            fetchProducts(); // Recargamos la lista
            toast.success('Producto eliminado correctamente');
        } catch (error) {
            console.error('Error al eliminar producto:', error);
            toast.error(`Error: ${error.message || 'No se pudo eliminar el producto'}`);
        } finally {
            setProductToDelete(null); // Cierra el modal de confirmación
        }
    };


    if (isLoading && !isModalOpen && !productToDelete) {
        return <p className="p-4">Cargando productos...</p>;
    }

    return (
        <section>
            {/* --- Encabezado y Botón "Crear" --- */}
            <div className="flex flex-wrap justify-between items-center gap-4 px-4 pt-4">
                <h3 className="text-text-main dark:text-white text-lg font-bold">
                    Listado de Productos
                </h3>
                <button
                    onClick={() => handleOpenModal(null)}
                    className="flex min-w-[84px] cursor-pointer items-center justify-center rounded-lg h-10 px-4 bg-primary text-white gap-2 pl-4 text-sm font-bold transition-colors hover:bg-primary/90"
                >
                    <span className="material-symbols-outlined">add</span>
                    <span className="truncate">Crear Producto</span>
                </button>
            </div>

            {/* --- VISTA MÓVIL (TARJETAS) --- */}
            <div className="px-4 py-3 space-y-4 md:hidden">
                {products.length > 0 ? (
                    products.map((product) => (
                        <article key={product._id} className="bg-white dark:bg-gray-800 rounded-lg shadow border border-border-light dark:border-gray-700 p-4">
                            {/* ... (Nombre, Precio, Descripción) ... */}
                             <h4 className="text-lg font-bold text-text-main dark:text-white mb-2">
                                {product.name}
                            </h4>
                            <div className="flex justify-between text-sm border-b border-border-light dark:border-gray-700 py-2">
                                <span className="text-text-muted dark:text-gray-400 font-medium">Precio</span>
                                <span className="text-text-main dark:text-gray-200">{currencyFormatter.format(product.unitPrice)}</span>
                            </div>
                            <div className="text-sm py-2">
                                <span className="text-text-muted dark:text-gray-400 font-medium">Descripción</span>
                                <p className="text-text-main dark:text-gray-200 mt-1">{product.description || 'N/A'}</p>
                            </div>

                            {/* Acciones */}
                            <footer className="flex items-center gap-4 pt-3 mt-2 border-t border-border-light dark:border-gray-700">
                                <button onClick={() => handleOpenModal(product)} className="flex items-center gap-1 text-primary dark:text-primary/90 hover:opacity-80">
                                    <span className="material-symbols-outlined text-base">edit</span>
                                    <span className="font-bold text-sm">Editar</span>
                                </button>
                                {/* ¡MODIFICADO! Este botón ahora abre el modal de borrado */}
                                <button 
                                    onClick={() => setProductToDelete(product)} 
                                    className="flex items-center gap-1 text-danger dark:text-danger/90 hover:opacity-80"
                                >
                                    <span className="material-symbols-outlined text-base">delete</span>
                                    <span className="font-bold text-sm">Eliminar</span>
                                </button>
                            </footer>
                        </article>
                    ))
                ) : (
                    <p className="text-center text-text-muted dark:text-gray-400 py-10">
                        Aún no tienes productos.
                    </p>
                )}
            </div>

            {/* --- VISTA DESKTOP (TABLA) --- */}
            <div className="px-4 py-3 hidden md:block">
                <div className="flex overflow-hidden rounded-lg border border-border-light dark:border-gray-700 bg-white dark:bg-background-dark">
                    <table className="flex-1">
                        <thead className="bg-white dark:bg-background-dark border-b border-border-light dark:border-gray-700">
                            <tr>
                                <th className="px-4 py-3 text-left text-text-main dark:text-gray-300 w-[25%] text-sm font-medium">Nombre</th>
                                <th className="px-4 py-3 text-left text-text-main dark:text-gray-300 w-[15%] text-sm font-medium">Precio Unitario</th>
                                <th className="px-4 py-3 text-left text-text-main dark:text-gray-300 w-[40%] text-sm font-medium">Descripción</th>
                                <th className="px-4 py-3 text-left text-text-main dark:text-gray-300 w-[20%] text-sm font-medium">Acciones</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-border-light dark:divide-gray-700">
                            {products.map((product) => (
                                <tr key={product._id}>
                                    <td className="h-[72px] px-4 py-2 text-text-main dark:text-white text-sm">
                                        {product.name}
                                    </td>
                                    <td className="h-[72px] px-4 py-2 text-text-muted dark:text-gray-400 text-sm">
                                        {currencyFormatter.format(product.unitPrice)}
                                    </td>
                                    <td className="h-[72px] px-4 py-2 text-text-muted dark:text-gray-400 text-sm">
                                        {product.description || 'N/A'}
                                    </td>
                                    <td className="h-[72px] px-4 py-2 text-sm">
                                        <div className="flex items-center gap-4">
                                            <button onClick={() => handleOpenModal(product)} className="flex items-center gap-1 text-primary dark:text-primary/90 hover:opacity-80">
                                                <span className="material-symbols-outlined text-base">edit</span>
                                                <span className="font-bold text-sm">Editar</span>
                                            </button>
                                            {/* ¡MODIFICADO! Este botón ahora abre el modal de borrado */}
                                            <button 
                                                onClick={() => setProductToDelete(product)} 
                                                className="flex items-center gap-1 text-danger dark:text-danger/90 hover:opacity-80"
                                            >
                                                <span className="material-symbols-outlined text-base">delete</span>
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* --- Modal (Crear/Editar Producto) --- */}
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
            
            {/* ¡CORRECCIÓN! Este es el Modal de Confirmación de Borrado que faltaba */}
            <Modal
                isOpen={!!productToDelete}
                onClose={() => setProductToDelete(null)}
                title="Confirmar Eliminación"
            >
                <div className="space-y-6">
                    <p className="text-gray-700 dark:text-gray-300">
                        ¿Estás seguro de que quieres eliminar el producto 
                        <strong className="text-gray-900 dark:text-white"> {productToDelete?.name}</strong>?
                        <br/>
                        Esta acción no se puede deshacer.
                    </p>
                    <footer className="flex justify-end gap-4 pt-4">
                        <button
                            type="button"
                            onClick={() => setProductToDelete(null)}
                            className="flex min-w-[84px] cursor-pointer items-center justify-center rounded-lg h-10 px-4 bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-200 text-sm font-bold"
                        >
                            Cancelar
                        </button>
                        <button
                            type="button"
                            onClick={handleConfirmDelete}
                            className="flex min-w-[84px] cursor-pointer items-center justify-center rounded-lg h-10 px-4 bg-danger text-white text-sm font-bold transition-colors hover:bg-opacity-90"
                        >
                            Eliminar
                        </button>
                    </footer>
                </div>
            </Modal>
        </section>
    );
};

export default ProductList;