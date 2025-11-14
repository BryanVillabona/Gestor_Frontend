import React, { useState, useEffect } from 'react';
import {
    getCustomers,
    createCustomer,
    updateCustomer,
    deleteCustomer,
} from '../../../services/customers.service';
import Modal from '../../../components/ui/Modal';
import CustomerForm from './CustomerForm';
import { toast } from 'react-hot-toast'; // 1. Importamos toast

const CustomerList = () => {
    const [customers, setCustomers] = useState([]);
    const [isLoading, setIsLoading] = useState(true);

    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedCustomer, setSelectedCustomer] = useState(null);

    // 2. NUEVO ESTADO: para guardar el cliente a eliminar
    const [customerToDelete, setCustomerToDelete] = useState(null);

    const fetchCustomers = async () => {
        try {
            setIsLoading(true);
            const data = await getCustomers();
            setCustomers(data);
        } catch (error) {
            console.error(error);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchCustomers();
    }, []);

    // Funciones para el modal de CREAR/EDITAR
    const handleOpenModal = (customer = null) => {
        setSelectedCustomer(customer);
        setIsModalOpen(true);
    };

    const handleCloseModal = () => {
        setIsModalOpen(false);
        setSelectedCustomer(null);
    };

    // 3. MODIFICADO: handleSaveCustomer ahora usa toast
    const handleSaveCustomer = async (customerData) => {
        try {
            if (selectedCustomer) {
                await updateCustomer(selectedCustomer._id, customerData);
            } else {
                await createCustomer(customerData);
            }
            fetchCustomers();
            handleCloseModal();
            // Añadimos toast de éxito
            toast.success(selectedCustomer ? 'Cliente actualizado' : 'Cliente creado');
        } catch (error) {
            // Reemplazamos alert por toast.error
            toast.error(`Error: ${error.message || 'No se pudo guardar el cliente'}`);
        }
    };

    // 4. MODIFICADO: Esta es la nueva función para confirmar el borrado
    const handleConfirmDelete = async () => {
        if (!customerToDelete) return; // No hacer nada si no hay cliente seleccionado

        try {
            await deleteCustomer(customerToDelete._id);
            fetchCustomers();
            toast.success('Cliente eliminado correctamente');
        } catch (error) {
            // Reemplazamos alert por toast.error
            toast.error(`Error: ${error.message || 'No se pudo eliminar el cliente'}`);
        } finally {
            setCustomerToDelete(null); // Cierra el modal de confirmación
        }
    };

    // 5. MODIFICADO: Ajustamos la condición de carga
    if (isLoading && !isModalOpen && !customerToDelete) {
        return <p className="p-4">Cargando clientes...</p>;
    }

    return (
        <section className="p-4 sm:p-6">
            {/* --- Encabezado y Botón "Crear" --- */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <h2 className="text-text-main dark:text-white text-[22px] font-bold">
                    Listado de Clientes
                </h2>
                <button
                    onClick={() => handleOpenModal(null)}
                    className="flex min-w-[84px] cursor-pointer items-center justify-center rounded-lg h-10 px-4 bg-primary text-white gap-2 pl-3 text-sm font-bold transition-colors hover:bg-primary/90"
                >
                    <span className="material-symbols-outlined">add</span>
                    <span className="truncate">Crear Nuevo Cliente</span>
                </button>
            </div>

            {/* --- VISTA MÓVIL (TARJETAS) --- */}
            <div className="mt-6 space-y-4 md:hidden">
                {customers.map((customer) => (
                    <article key={customer._id} className="bg-white dark:bg-gray-800 rounded-lg shadow border border-border-light dark:border-gray-700 p-4">
                        <h4 className="text-lg font-bold text-text-main dark:text-white mb-2">
                            {customer.name}
                        </h4>

                        <div className="text-sm border-b border-border-light dark:border-gray-700 py-2">
                            <span className="text-text-muted dark:text-gray-400 font-medium">Teléfono: </span>
                            <span className="text-text-main dark:text-gray-200">{customer.phone || 'N/A'}</span>
                        </div>

                        <div className="text-sm border-b border-border-light dark:border-gray-700 py-2">
                            <span className="text-text-muted dark:text-gray-400 font-medium">Dirección: </span>
                            <span className="text-text-main dark:text-gray-200">{customer.address || 'N/A'}</span>
                        </div>

                        <div className="text-sm py-2">
                            <span className="text-text-muted dark:text-gray-400 font-medium">Notas: </span>
                            <p className="text-text-main dark:text-gray-200 mt-1">{customer.notes || 'N/A'}</p>
                        </div>

                        <footer className="flex items-center gap-4 pt-3 mt-2 border-t border-border-light dark:border-gray-700">
                            <button onClick={() => handleOpenModal(customer)} className="flex items-center gap-1 text-primary dark:text-primary/90 hover:opacity-80">
                                <span className="material-symbols-outlined text-base">edit</span>
                                <span className="font-bold text-sm">Editar</span>
                            </button>
                            {/* 6. MODIFICADO: El botón de eliminar ahora abre el modal de confirmación */}
                            <button 
                                onClick={() => setCustomerToDelete(customer)} 
                                className="flex items-center gap-1 text-danger dark:text-danger/90 hover:opacity-80"
                            >
                                <span className="material-symbols-outlined text-base">delete</span>
                                <span className="font-bold text-sm">Eliminar</span>
                            </button>
                        </footer>
                    </article>
                ))}
            </div>

            {/* --- VISTA DESKTOP (TABLA) --- */}
            <div className="mt-6 flow-root hidden md:block">
                <div className="inline-block min-w-full py-2 align-middle">
                    <div className="overflow-hidden shadow ring-1 ring-black ring-opacity-5 dark:ring-white dark:ring-opacity-10 rounded-lg">
                        <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                            <thead className="bg-gray-50 dark:bg-gray-800">
                                <tr>
                                    <th scope="col" className="py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-gray-900 dark:text-white sm:pl-6">Nombre</th>
                                    <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900 dark:text-white">Teléfono</th>
                                    <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900 dark:text-white">Dirección</th>
                                    <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900 dark:text-white">Notas</th>
                                    <th scope="col" className="relative py-3.5 pl-3 pr-4 sm:pr-6"><span className="sr-only">Acciones</span></th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-200 dark:divide-gray-700 bg-white dark:bg-background-dark">
                                {customers.map((customer) => (
                                    <tr key={customer._id}>
                                        <td className="whitespace-nowrap py-4 pl-4 pr-3 text-sm font-medium text-gray-900 dark:text-gray-200 sm:pl-6">
                                            {customer.name}
                                        </td>
                                        <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500 dark:text-gray-400">{customer.phone || 'N/A'}</td>
                                        <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500 dark:text-gray-400">{customer.address || 'N/A'}</td>
                                        <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500 dark:text-gray-400">{customer.notes || 'N/A'}</td>
                                        <td className="relative whitespace-nowrap py-4 pl-3 pr-4 text-right text-sm font-medium sm:pr-6">
                                            <div className="flex gap-4 justify-end">
                                                <button onClick={() => handleOpenModal(customer)} className="text-primary hover:text-primary/80">
                                                    <span className="material-symbols-outlined text-base">edit</span>
                                                </button>
                                                {/* 7. MODIFICADO: El botón de eliminar ahora abre el modal de confirmación */}
                                                <button 
                                                    onClick={() => setCustomerToDelete(customer)} 
                                                    className="text-danger hover:text-danger/80"
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
            </div>

            {/* --- Modal (Crear/Editar Cliente) --- */}
            <Modal
                isOpen={isModalOpen}
                onClose={handleCloseModal}
                title={selectedCustomer ? 'Editar Cliente' : 'Crear Nuevo Cliente'}
            >
                <CustomerForm
                    key={selectedCustomer ? selectedCustomer._id : 'new'}
                    customer={selectedCustomer}
                    onSubmit={handleSaveCustomer}
                    onCancel={handleCloseModal}
                />
            </Modal>

            {/* 8. NUEVO: Modal de Confirmación de Borrado */}
            <Modal
                isOpen={!!customerToDelete}
                onClose={() => setCustomerToDelete(null)}
                title="Confirmar Eliminación"
            >
                <div className="space-y-6">
                    <p className="text-gray-700 dark:text-gray-300">
                        ¿Estás seguro de que quieres eliminar al cliente
                        <strong className="text-gray-900 dark:text-white"> {customerToDelete?.name}</strong>?
                        <br/>
                        Esta acción no se puede deshacer.
                    </p>
                    <footer className="flex justify-end gap-4 pt-4">
                        <button
                            type="button"
                            onClick={() => setCustomerToDelete(null)}
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

export default CustomerList;