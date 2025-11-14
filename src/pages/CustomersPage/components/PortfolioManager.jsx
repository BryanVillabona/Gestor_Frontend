import React, { useState, useEffect } from 'react';
import { getCustomers } from '../../../services/customers.service';
import { createPayment } from '../../../services/payments.service';
import { getCustomerPortfolio } from '../../../services/reports.service';

const currencyFormatter = new Intl.NumberFormat('es-CO', {
    style: 'currency',
    currency: 'COP',
    maximumFractionDigits: 0,
});

const PortfolioManager = () => {
    // Lista de clientes para los dropdowns
    const [customers, setCustomers] = useState([]);

    // --- Estados para "Registrar Abono" ---
    const [paymentData, setPaymentData] = useState({
        customerId: '',
        amount: '',
        method: 'Efectivo',
    });

    // --- Estados para "Consultar Saldo" ---
    const [selectedCustomerId, setSelectedCustomerId] = useState('');
    const [portfolio, setPortfolio] = useState(null); // Aquí se guarda el resultado
    const [isLoadingPortfolio, setIsLoadingPortfolio] = useState(false);

    // Carga inicial de clientes
    useEffect(() => {
        const fetchCustomersData = async () => {
            const data = await getCustomers();
            setCustomers(data);
            // Setea por defecto el primer cliente en ambos formularios
            if (data.length > 0) {
                setPaymentData(prev => ({ ...prev, customerId: data[0]._id }));
                setSelectedCustomerId(data[0]._id);
            }
        };
        fetchCustomersData();
    }, []);

    // --- Manejadores de "Registrar Abono" ---
    const handlePaymentChange = (e) => {
        const { name, value } = e.target;
        setPaymentData(prev => ({ ...prev, [name]: value }));
    };

    const handlePaymentSubmit = async (e) => {
        e.preventDefault();
        try {
            await createPayment({
                ...paymentData,
                amount: Number(paymentData.amount)
            });
            alert('¡Abono registrado exitosamente!');
            // Limpia el formulario
            setPaymentData(prev => ({ ...prev, amount: '' }));
            // Refresca la consulta de saldo si es el mismo cliente
            if (paymentData.customerId === selectedCustomerId) {
                handlePortfolioSubmit();
            }
        } catch (error) {
            alert(`Error al registrar abono: ${error.message || 'Error'}`);
        }
    };

    // --- Manejadores de "Consultar Saldo" ---
    const handlePortfolioSubmit = async (e) => {
        if (e) e.preventDefault(); // Permite llamarlo sin evento
        if (!selectedCustomerId) {
            alert('Selecciona un cliente');
            return;
        }
        try {
            setIsLoadingPortfolio(true);
            const data = await getCustomerPortfolio(selectedCustomerId);
            setPortfolio(data);
        } catch (error) {
            alert(`Error al consultar cartera: ${error.message || 'Error'}`);
        } finally {
            setIsLoadingPortfolio(false);
        }
    };

    return (
        // HTML Semántico: <section> para la página
        <section className="p-4 sm:p-6 grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Columna 1: Registrar Abono */}
            <article className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700">
                <h2 className="text-[#111518] dark:text-white text-[22px] font-bold mb-6">
                    Registrar Abono a Cartera
                </h2>
                <form onSubmit={handlePaymentSubmit} className="space-y-6">
                    <label className="flex flex-col w-full">
                        <span className="... text-sm font-medium pb-2">Cliente</span>
                        <select name="customerId" value={paymentData.customerId} onChange={handlePaymentChange} required className="form-select ... h-12 ...">
                            {customers.map(c => (
                                <option key={c._id} value={c._id}>{c.name}</option>
                            ))}
                        </select>
                    </label>
                    <label className="flex flex-col w-full">
                        <span className="... text-sm font-medium pb-2">Monto Abonado</span>
                        <input name="amount" type="number" min="1" value={paymentData.amount} onChange={handlePaymentChange} required className="form-input ... h-12 ..." />
                    </label>
                    <label className="flex flex-col w-full">
                        <span className="... text-sm font-medium pb-2">Método de Pago</span>
                        <select name="method" value={paymentData.method} onChange={handlePaymentChange} required className="form-select ... h-12 ...">
                            <option>Efectivo</option>
                            <option>Nequi</option>
                            <option>Bancolombia</option>
                            <option>Otro</option>
                        </select>
                    </label>
                    <button
                        type="submit"
                        className="flex h-10 px-4 bg-primary text-white text-sm font-bold w-full justify-center items-center rounded-lg transition-colors hover:bg-primary/90"
                    >
                        Registrar Abono
                    </button>
                </form>
            </article>

            {/* Columna 2: Consultar Saldo */}
            <article className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700">
                <h2 className="text-[#111518] dark:text-white text-[22px] font-bold mb-6">
                    Consultar Estado de Cuenta
                </h2>
                <form onSubmit={handlePortfolioSubmit} className="space-y-6">
                    <label className="flex flex-col w-full">
                        <span className="... text-sm font-medium pb-2">Cliente</span>
                        <select value={selectedCustomerId} onChange={(e) => setSelectedCustomerId(e.target.value)} required className="form-select ... h-12 ...">
                            {customers.map(c => (
                                <option key={c._id} value={c._id}>{c.name}</option>
                            ))}
                        </select>
                    </label>
                    <button
                        type="submit"
                        className="flex h-10 px-4 bg-gray-200 text-gray-800 dark:bg-gray-700 dark:text-gray-200 text-sm font-bold w-full justify-center items-center rounded-lg transition-colors hover:bg-gray-300 dark:hover:bg-gray-600"
                    >
                        {isLoadingPortfolio ? 'Consultando...' : 'Consultar Saldo'}
                    </button>
                </form>

                {/* Resultados de la Consulta */}
                {portfolio && !isLoadingPortfolio && (
                    <div className="mt-8 space-y-4 pt-6 border-t border-gray-200 dark:border-gray-700">
                        <h3 className="text-lg font-semibold dark:text-white">Balance del Cliente</h3>
                        <div className="space-y-2">
                            <div className="flex justify-between text-sm">
                                <p className="text-gray-500 dark:text-gray-400">Total Facturado</p>
                                <p className="dark:text-white">{currencyFormatter.format(portfolio.totalBilled)}</p>
                            </div>
                            <div className="flex justify-between text-sm">
                                <p className="text-gray-500 dark:text-gray-400">Total Pagado</p>
                                <p className="text-green-600 dark:text-green-400">{currencyFormatter.format(portfolio.totalPaid)}</p>
                            </div>
                            <hr className="dark:border-gray-600" />
                            <div className="flex justify-between text-lg font-bold">
                                <p className="dark:text-white">Balance (Deuda)</p>
                                <p className={portfolio.balance > 0 ? 'text-red-600 dark:text-red-400' : 'dark:text-white'}>
                                    {currencyFormatter.format(portfolio.balance)}
                                </p>
                            </div>
                        </div>
                    </div>
                )}
            </article>
        </section>
    );
};

export default PortfolioManager;