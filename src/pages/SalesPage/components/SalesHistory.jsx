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

// Función auxiliar para darle color al método de pago
const getMethodBadge = (method) => {
    const styles = {
        'Efectivo': 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300',
        'Nequi': 'bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-300',
        'Bancolombia': 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300',
        'Otro': 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300',
    };
    return styles[method] || styles['Otro'];
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
        return <p className="p-4 text-gray-500 dark:text-gray-400">Cargando historial de ventas...</p>;
    }

    return (
        <section className="mt-6">
            <div className="bg-white dark:bg-gray-900/50 rounded-xl border border-border-light dark:border-gray-800 overflow-hidden">
                <div className="p-5 border-b border-border-light dark:border-gray-800">
                    <h2 className="text-gray-900 dark:text-white text-lg font-bold">
                        Historial de Ventas
                    </h2>
                </div>

                {/* --- VISTA MÓVIL (TARJETAS) --- */}
                <div className="space-y-4 p-4 md:hidden">
                    {sales.map((sale) => (
                        <article key={sale._id} className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-border-light dark:border-gray-700 p-4">
                            <div className="flex justify-between items-start mb-3">
                                <div>
                                    <h4 className="text-lg font-bold text-text-main dark:text-white">
                                        {sale.customerId?.name || 'Cliente Eliminado'}
                                    </h4>
                                    <span className="text-xs text-text-muted dark:text-gray-400">{dateFormatter(sale.date)}</span>
                                </div>
                                {/* Badge de Método de Pago (Móvil) */}
                                <span className={`px-2 py-1 rounded text-xs font-bold ${getMethodBadge(sale.paymentMethod)}`}>
                                    {sale.paymentMethod}
                                </span>
                            </div>

                            <div className="space-y-2 text-sm">
                                <div className="flex justify-between border-b border-border-light dark:border-gray-700 pb-2">
                                    <span className="text-text-muted dark:text-gray-400 font-medium">Total Venta:</span>
                                    <span className="text-text-main dark:text-gray-200 font-bold">{currencyFormatter.format(sale.totalAmount)}</span>
                                </div>

                                <div className="flex justify-between border-b border-border-light dark:border-gray-700 pb-2">
                                    <span className="text-text-muted dark:text-gray-400 font-medium">Pagado:</span>
                                    <span className="text-success font-semibold">{currencyFormatter.format(sale.amountPaid)}</span>
                                </div>

                                <div className="flex justify-between pt-1">
                                    <span className="text-text-muted dark:text-gray-400 font-medium">Pendiente:</span>
                                    <span className={`font-bold ${sale.amountPending > 0 ? 'text-danger' : 'text-gray-400'}`}>
                                        {currencyFormatter.format(sale.amountPending)}
                                    </span>
                                </div>
                            </div>
                        </article>
                    ))}
                </div>

                {/* --- VISTA DESKTOP (TABLA) --- */}
                <div className="overflow-x-auto hidden md:block">
                    <table className="w-full text-left">
                        <thead className="bg-gray-50 dark:bg-white/5 border-b border-gray-200 dark:border-gray-700">
                            <tr>
                                <th className="p-4 text-sm font-semibold text-gray-600 dark:text-gray-300">Fecha</th>
                                <th className="p-4 text-sm font-semibold text-gray-600 dark:text-gray-300">Cliente</th>
                                <th className="p-4 text-sm font-semibold text-gray-600 dark:text-gray-300">Método Pago</th> {/* Nueva Columna */}
                                <th className="p-4 text-sm font-semibold text-gray-600 dark:text-gray-300 text-right">Total Venta</th>
                                <th className="p-4 text-sm font-semibold text-gray-600 dark:text-gray-300 text-right">Pagado</th>
                                <th className="p-4 text-sm font-semibold text-gray-600 dark:text-gray-300 text-right">Pendiente</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-200 dark:divide-gray-800">
                            {sales.map((sale) => (
                                <tr key={sale._id} className="hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors">
                                    <td className="p-4 text-sm font-medium text-gray-800 dark:text-gray-200 whitespace-nowrap">
                                        {dateFormatter(sale.date)}
                                    </td>
                                    <td className="p-4 text-sm text-gray-600 dark:text-gray-400 font-medium">
                                        {sale.customerId?.name || 'Cliente Eliminado'}
                                    </td>
                                    {/* Columna Método de Pago con Estilo */}
                                    <td className="p-4 text-sm">
                                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getMethodBadge(sale.paymentMethod)}`}>
                                            {sale.paymentMethod}
                                        </span>
                                    </td>
                                    <td className="p-4 text-sm text-gray-600 dark:text-gray-400 text-right font-medium">
                                        {currencyFormatter.format(sale.totalAmount)}
                                    </td>
                                    <td className="p-4 text-sm text-success text-right font-bold">
                                        {currencyFormatter.format(sale.amountPaid)}
                                    </td>
                                    <td className={`p-4 text-sm text-right font-bold ${sale.amountPending > 0 ? 'text-danger' : 'text-gray-400'}`}>
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