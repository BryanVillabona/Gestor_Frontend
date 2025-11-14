import React, { useState, useEffect } from 'react';
import { getSales } from '../../../services/sales.service';

// Formateadores
const currencyFormatter = new Intl.NumberFormat('es-CO', {
    style: 'currency',
    currency: 'COP',
    maximumFractionDigits: 0,
});
const dateFormatter = (dateString) => {
    return new Date(dateString).toLocaleDateString('es-CO', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
    });
};

const SalesHistory = () => {
    const [sales, setSales] = useState([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const fetchSales = async () => {
            try {
                setIsLoading(true);
                const data = await getSales();
                setSales(data);
            } catch (error) {
                console.error(error);
            } finally {
                setIsLoading(false);
            }
        };
        fetchSales();
    }, []);

    if (isLoading) {
        return <p className="p-4">Cargando historial de ventas...</p>;
    }

    return (
        <section className="mt-6">
            <div className="bg-white dark:bg-gray-900/50 rounded-xl border border-border-light dark:border-gray-800 overflow-hidden">
                <div className="p-5">
                    <h2 className="text-gray-900 dark:text-white text-lg font-bold">
                        Historial de Ventas
                    </h2>
                </div>

                {/* --- VISTA MÓVIL (TARJETAS) --- */}
                <div className="space-y-4 p-4 md:hidden">
                    {sales.map((sale) => (
                        <article key={sale._id} className="bg-white dark:bg-gray-800 rounded-lg shadow border border-border-light dark:border-gray-700 p-4">
                            <div className="flex justify-between items-start mb-2">
                                <h4 className="text-lg font-bold text-text-main dark:text-white">
                                    {sale.customerId?.name || 'Cliente Eliminado'}
                                </h4>
                                <span className="text-xs text-text-muted dark:text-gray-400">{dateFormatter(sale.date)}</span>
                            </div>

                            <div className="text-sm border-b border-border-light dark:border-gray-700 py-2">
                                <span className="text-text-muted dark:text-gray-400 font-medium">Total: </span>
                                <span className="text-text-main dark:text-gray-200 font-bold">{currencyFormatter.format(sale.totalAmount)}</span>
                            </div>

                            <div className="text-sm border-b border-border-light dark:border-gray-700 py-2">
                                <span className="text-text-muted dark:text-gray-400 font-medium">Pagado: </span>
                                <span className="text-success">{currencyFormatter.format(sale.amountPaid)}</span>
                            </div>

                            <div className="text-sm py-2">
                                <span className="text-text-muted dark:text-gray-400 font-medium">Pendiente: </span>
                                <span className="text-danger font-bold">{currencyFormatter.format(sale.amountPending)}</span>
                            </div>
                        </article>
                    ))}
                </div>

                {/* --- VISTA DESKTOP (TABLA) --- */}
                <div className="overflow-x-auto hidden md:block">
                    <table className="w-full text-left">
                        <thead className="bg-gray-50 dark:bg-white/5">
                            <tr>
                                <th className="p-4 text-sm font-semibold text-gray-600 dark:text-gray-300">Fecha</th>
                                <th className="p-4 text-sm font-semibold text-gray-600 dark:text-gray-300">Cliente</th>
                                <th className="p-4 text-sm font-semibold text-gray-600 dark:text-gray-300 text-right">Total Venta</th>
                                <th className="p-4 text-sm font-semibold text-gray-600 dark:text-gray-300 text-right">Pagado</th>
                                <th className="p-4 text-sm font-semibold text-gray-600 dark:text-gray-300 text-right">Pendiente</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-200 dark:divide-gray-800">
                            {sales.map((sale) => (
                                <tr key={sale._id}>
                                    <td className="p-4 text-sm font-medium text-gray-800 dark:text-gray-200 whitespace-nowrap">
                                        {dateFormatter(sale.date)}
                                    </td>
                                    <td className="p-4 text-sm text-gray-600 dark:text-gray-400">
                                        {sale.customerId?.name || 'Cliente Eliminado'}
                                    </td>
                                    <td className="p-4 text-sm text-gray-600 dark:text-gray-400 text-right">
                                        {currencyFormatter.format(sale.totalAmount)}
                                    </td>
                                    <td className="p-4 text-sm text-success text-right">
                                        {currencyFormatter.format(sale.amountPaid)}
                                    </td>
                                    <td className="p-4 text-sm text-danger font-bold text-right">
                                        {currencyFormatter.format(sale.amountPending)}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </section>
    );
};

export default SalesHistory;