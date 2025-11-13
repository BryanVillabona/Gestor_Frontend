import React, { useState, useEffect } from 'react';
import {
  getCustomers,
  createCustomer,
  updateCustomer,
  deleteCustomer,
} from '../../../services/customers.service';
import Modal from '../../../components/ui/Modal';
import CustomerForm from './CustomerForm';

const CustomerList = () => {
  const [customers, setCustomers] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedCustomer, setSelectedCustomer] = useState(null);

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

  const handleOpenModal = (customer = null) => {
    setSelectedCustomer(customer);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedCustomer(null);
  };

  const handleSaveCustomer = async (customerData) => {
    try {
      if (selectedCustomer) {
        await updateCustomer(selectedCustomer._id, customerData);
      } else {
        await createCustomer(customerData);
      }
      fetchCustomers();
      handleCloseModal();
    } catch (error) {
      alert(`Error: ${error.message || 'No se pudo guardar el cliente'}`);
    }
  };

  const handleDeleteCustomer = async (customerId) => {
    if (window.confirm('¿Estás seguro de que quieres eliminar este cliente?')) {
      try {
        await deleteCustomer(customerId);
        fetchCustomers();
      } catch (error) {
        alert(`Error: ${error.message || 'No se pudo eliminar el cliente'}`);
      }
    }
  };

  if (isLoading && !isModalOpen) {
    return <p>Cargando clientes...</p>;
  }

  return (
    // HTML del Mockup
    <section className="p-4 sm:p-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <h2 className="text-[#111518] dark:text-white text-[22px] font-bold">
          Listado de Clientes
        </h2>
        <button
          onClick={() => handleOpenModal(null)}
          className="flex ... h-10 px-4 bg-primary text-gray-800 ... text-sm font-bold"
        >
          <span className="material-symbols-outlined">add</span>
          <span className="truncate">Crear Nuevo Cliente</span>
        </button>
      </div>

      <div className="mt-6 flow-root">
        <div className="inline-block min-w-full py-2 align-middle">
          <div className="overflow-hidden shadow ring-1 ring-black ring-opacity-5 ... rounded-lg">
            <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
              <thead className="bg-gray-50 dark:bg-gray-800">
                <tr>
                  <th scope="col" className="py-3.5 pl-4 ... text-left text-sm font-semibold ...">Nombre</th>
                  <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold ...">Teléfono</th>
                  <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold ...">Dirección</th>
                  <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold ...">Notas</th>
                  <th scope="col" className="relative py-3.5 pl-3 pr-4">
                    <span className="sr-only">Acciones</span>
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y ... bg-white dark:bg-background-dark">
                {customers.map((customer) => (
                  <tr key={customer._id}>
                    <td className="whitespace-nowrap py-4 pl-4 ... text-sm font-medium ...">
                      {customer.name}
                    </td>
                    <td className="whitespace-nowrap px-3 py-4 text-sm ...">{customer.phone || 'N/A'}</td>
                    <td className="whitespace-nowrap px-3 py-4 text-sm ...">{customer.address || 'N/A'}</td>
                    <td className="whitespace-nowrap px-3 py-4 text-sm ...">{customer.notes || 'N/A'}</td>
                    <td className="relative whitespace-nowrap py-4 pl-3 pr-4 text-right text-sm font-medium">
                      <div className="flex gap-4 justify-end">
                        <button
                          onClick={() => handleOpenModal(customer)}
                          className="text-primary hover:text-primary/80"
                        >
                          <span className="material-symbols-outlined text-base">edit</span>
                        </button>
                        <button
                          onClick={() => handleDeleteCustomer(customer._id)}
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
    </section>
  );
};

export default CustomerList;