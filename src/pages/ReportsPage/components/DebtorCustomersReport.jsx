import React, { useState, useEffect } from 'react';
import { toast } from 'react-hot-toast';
import { getDebtorCustomers } from '../../../services/reports.service';
import AccountStatementModal from './AccountStatementModal';

// Formateador de moneda
const currencyFormatter = new Intl.NumberFormat('es-CO', {
    style: 'currency',
    currency: 'COP',
    maximumFractionDigits: 0,
});

const DebtorCustomersReport = () => {
    const [debtors, setDebtors] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [selectedCustomerId, setSelectedCustomerId] = useState(null);

    useEffect(() => {
        const fetchDebtors = async () => {
            try {
                setIsLoading(true);
                const data = await getDebtorCustomers();
                setDebtors(data);
            } catch (error) {
                toast.error(`Error al cargar deudores: ${error.message}`);
            } finally {
                setIsLoading(false);
            }
        };
        fetchDebtors();
    }, []);

    const handleOpenModal = (customerId) => {
        setSelectedCustomerId(customerId);
    };
    const handleCloseModal = () => {
        setSelectedCustomerId(null);
    };

    if (isLoading) {
        return (
            <article className="bg-white dark:bg-gray-900/50 p-6 rounded-xl border border-gray-200 dark:border-gray-800">
                <h2 className="text-gray-900 dark:text-white text-lg font-bold mb-4">
                    Clientes por Cobrar
                </h2>
                <p className="text-sm text-gray-500">Cargando reporte...</p>
            </article>
        );
    }

    return (
        <article className="bg-white dark:bg-gray-900/50 rounded-xl border border-gray-200 dark:border-gray-800 overflow-hidden">
            <div className="p-5">
                <h2 className="text-gray-900 dark:text-white text-lg font-bold">
                    Clientes por Cobrar (Deudores)
                </h2>
            </div>

            {debtors.length === 0 ? (
                <p className="p-5 text-sm text-gray-500">¡Felicidades! Ningún cliente tiene saldos pendientes.</p>
            ) : (
                <div className="overflow-x-auto">
                    <table className="w-full text-left">
                        <thead className="bg-gray-50 dark:bg-white/5">
                            <tr>
                                <th className="p-4 text-sm font-semibold ...">Cliente</th>
                                <th className="p-4 text-sm font-semibold ...">Teléfono</th>
                                <th className="p-4 text-sm font-semibold ... text-right">Deuda Actual</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-200 dark:divide-gray-800">
                            {debtors.map((item) => (
                                <tr key={item.customerId}>
                                    <td className="p-4 text-sm font-medium ...">
                                        <button
                                            onClick={() => handleOpenModal(item.customerId)}
                                            className="text-primary hover:underline font-bold"
                                        >
                                            {item.name}
                                        </button>
                                    </td>
                                    <td className="p-4 text-sm ...">{item.phone}</td>
                                    <td className="p-4 text-sm font-bold text-danger text-right">
                                        {currencyFormatter.format(item.balance)}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}
            {selectedCustomerId && (
                <AccountStatementModal
                    customerId={selectedCustomerId}
                    onClose={handleCloseModal}
                />
            )}
        </article>
    );
};

export default DebtorCustomersReport;