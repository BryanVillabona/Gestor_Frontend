import React, { useState, useEffect } from 'react';
import { toast } from 'react-hot-toast';
import { getCustomerPortfolio } from '../../../services/reports.service';
import Modal from '../../../components/ui/Modal'; // Tu componente de Modal

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
        hour: 'numeric',
        minute: 'numeric'
    });
};

const AccountStatementModal = ({ customerId, onClose }) => {
    const [report, setReport] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const [transactions, setTransactions] = useState([]);

    useEffect(() => {
        if (!customerId) return;

        const fetchAccountStatement = async () => {
            try {
                setIsLoading(true);
                const data = await getCustomerPortfolio(customerId);
                setReport(data);

                // --- AQUI LA MAGIA (El "Kardex") ---
                // 1. Mapeamos las ventas a un formato estándar
                const sales = data.salesHistory.map(sale => ({
                    id: sale._id,
                    date: new Date(sale.date),
                    description: `Venta (Factura)`,
                    // Descripción de items (opcional pero útil)
                    // details: sale.items.map(item => `${item.quantity}x ${item.productName}`).join(', '),
                    debit: sale.totalAmount, // Débito (Aumenta la deuda)
                    credit: sale.amountPaid, // Crédito (Reduce la deuda en la misma venta)
                }));

                // 2. Mapeamos los abonos a un formato estándar
                const payments = data.paymentsHistory.map(payment => ({
                    id: payment._id,
                    date: new Date(payment.date),
                    description: `Abono (${payment.method})`,
                    // details: '',
                    debit: 0, // Un abono no aumenta la deuda
                    credit: payment.amount, // Crédito (Reduce la deuda)
                }));

                // 3. Unimos y ordenamos por fecha (más reciente primero)
                const allTransactions = [...sales, ...payments]
                    .sort((a, b) => b.date - a.date);

                setTransactions(allTransactions);

            } catch (error) {
                toast.error(`Error al cargar estado de cuenta: ${error.message}`);
                onClose(); // Cierra el modal si hay error
            } finally {
                setIsLoading(false);
            }
        };

        fetchAccountStatement();
    }, [customerId, onClose]);

    return (
        <Modal
            isOpen={true}
            onClose={onClose}
            title={isLoading ? 'Cargando...' : `Estado de Cuenta: ${report?.name || ''}`}
        >
            {isLoading ? (
                <p>Cargando reporte...</p>
            ) : report && (
                <div className="space-y-6">
                    {/* Sección 1: Totales */}
                    <section className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div className="bg-gray-100 dark:bg-gray-700 p-4 rounded-lg">
                            <p className="text-sm text-gray-500 dark:text-gray-400">Total Facturado</p>
                            <p className="text-lg font-bold text-gray-900 dark:text-white">
                                {currencyFormatter.format(report.totalBilled)}
                            </p>
                        </div>
                        <div className="bg-gray-100 dark:bg-gray-700 p-4 rounded-lg">
                            <p className="text-sm text-gray-500 dark:text-gray-400">Total Pagado</p>
                            <p className="text-lg font-bold text-green-600 dark:text-green-400">
                                {currencyFormatter.format(report.totalPaid)}
                            </p>
                        </div>
                        <div className="bg-red-50 dark:bg-red-900/20 p-4 rounded-lg border border-red-200 dark:border-red-700">
                            <p className="text-sm text-red-600 dark:text-red-400">Deuda Actual</p>
                            <p className="text-lg font-bold text-red-600 dark:text-red-400">
                                {currencyFormatter.format(report.balance)}
                            </p>
                        </div>
                    </section>

                    {/* Sección 2: Historial de Transacciones (El "Kardex") */}
                    <section>
                        <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-4">
                            Historial de Transacciones
                        </h3>
                        <div className="overflow-auto border border-gray-200 dark:border-gray-700 rounded-lg max-h-96">
                            <table className="w-full min-w-[600px] text-left">
                                <thead className="bg-gray-50 dark:bg-white/5 sticky top-0">
                                    <tr>
                                        <th className="p-3 text-sm font-semibold ...">Fecha</th>
                                        <th className="p-3 text-sm font-semibold ...">Descripción</th>
                                        <th className="p-3 text-sm font-semibold ... text-right">Facturado (Debe)</th>
                                        <th className="p-3 text-sm font-semibold ... text-right">Pagado (Haber)</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-200 dark:divide-gray-800">
                                    {transactions.map(t => (
                                        <tr key={t.id}>
                                            <td className="p-3 text-sm ... whitespace-nowrap">{dateFormatter(t.date)}</td>
                                            <td className="p-3 text-sm ...">{t.description}</td>
                                            <td className="p-3 text-sm ... text-right">
                                                {t.debit > 0 ? currencyFormatter.format(t.debit) : '-'}
                                            </td>
                                            <td className="p-3 text-sm text-green-600 dark:text-green-400 text-right">
                                                {t.credit > 0 ? currencyFormatter.format(t.credit) : '-'}
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </section>

                </div>
            )}
        </Modal>
    );
};

export default AccountStatementModal;