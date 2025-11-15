import React, { useState } from 'react';
import { toast } from 'react-hot-toast';
import { getSalesByDateRange } from '../../../services/reports.service';

const currencyFormatter = new Intl.NumberFormat('es-CO', {
    style: 'currency',
    currency: 'COP',
    maximumFractionDigits: 0,
});

// Función para obtener la fecha de hoy en formato YYYY-MM-DD
const getTodayDate = () => {
    const now = new Date();
    const offset = now.getTimezoneOffset() * 60000;
    const localDate = new Date(now.getTime() - offset);
    return localDate.toISOString().split('T')[0];
};

const DateRangeReport = () => {
    // Estado para los inputs de fecha
    const [dates, setDates] = useState({
        startDate: getTodayDate(),
        endDate: getTodayDate(),
    });

    // Estado para guardar los resultados del reporte
    const [reportData, setReportData] = useState(null);
    const [isLoading, setIsLoading] = useState(false);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setDates(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            setIsLoading(true);
            const data = await getSalesByDateRange(dates.startDate, dates.endDate);
            setReportData(data);
        } catch (error) {
            toast.error(`Error al generar reporte: ${error.message || 'Error'}`);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        // HTML del Mockup
        <section className="flex flex-col gap-8">
            {/* 1. Sección de Generación de Reporte (Formulario) */}
            <article className="bg-white dark:bg-gray-900/50 p-6 rounded-xl border border-gray-200 dark:border-gray-800">
                <h2 className="text-gray-900 dark:text-white text-[22px] font-bold ... mb-4">
                    Reporte de Ventas por Período
                </h2>
                <form onSubmit={handleSubmit} className="flex flex-col md:flex-row md:items-end gap-4">
                    <label className="flex flex-col min-w-40 flex-1">
                        <p className="... text-sm font-medium pb-2">Fecha de Inicio</p>
                        <input
                            name="startDate"
                            type="date"
                            value={dates.startDate}
                            onChange={handleChange}
                            required
                            className="form-input ... h-12 ..."
                        />
                    </label>
                    <label className="flex flex-col min-w-40 flex-1">
                        <p className="... text-sm font-medium pb-2">Fecha de Fin</p>
                        <input
                            name="endDate"
                            type="date"
                            value={dates.endDate}
                            onChange={handleChange}
                            required
                            className="form-input ... h-12 ..."
                        />
                    </label>
                    <button
                        type="submit"
                        disabled={isLoading}
                        className="flex min-w-[84px] cursor-pointer items-center justify-center overflow-hidden rounded-lg h-12 px-5 bg-primary text-white text-base font-bold leading-normal tracking-[0.015em] transition-colors hover:bg-primary/90 disabled:opacity-50"
                    >
                        {isLoading ? 'Generando...' : 'Generar Reporte'}
                    </button>
                </form>
            </article>

            {/* 2. Sección de Resultados (se muestra solo si hay data) */}
            {reportData && !isLoading && (
                <section className="flex flex-col gap-8">
                    {/* Tarjetas de Métricas */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="bg-white dark:bg-gray-900/50 p-5 rounded-xl border ...">
                            <div className="flex items-center gap-3 mb-2">
                                <div className="bg-primary/10 text-primary p-2 rounded-lg">
                                    <span className="material-symbols-outlined">request_quote</span>
                                </div>
                                <h3 className="... text-base font-medium">Total Facturado</h3>
                            </div>
                            <p className="... text-4xl font-bold">
                                {currencyFormatter.format(reportData.totalSold)}
                            </p>
                        </div>
                        <div className="bg-white dark:bg-gray-900/50 p-5 rounded-xl border ...">
                            <div className="flex items-center gap-3 mb-2">
                                <div className="bg-green-500/10 text-green-500 p-2 rounded-lg">
                                    <span className="material-symbols-outlined">payments</span>
                                </div>
                                <h3 className="... text-base font-medium">Total Recaudado (Ingreso)</h3>
                            </div>
                            <p className="... text-4xl font-bold">
                                {currencyFormatter.format(reportData.totalIncome)}
                            </p>
                        </div>
                    </div>

                    {/* Tabla de Desglose por Producto */}
                    <article className="bg-white dark:bg-gray-900/50 rounded-xl border ... overflow-hidden">
                        <div className="p-5">
                            <h2 className="... text-lg font-bold">Desglose por Producto</h2>
                        </div>
                        <div className="overflow-x-auto">
                            <table className="w-full text-left">
                                <thead className="bg-gray-50 dark:bg-white/5">
                                    <tr>
                                        <th className="p-4 text-sm font-semibold ...">Producto</th>
                                        <th className="p-4 text-sm font-semibold ... text-right">Unidades Vendidas</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-200 dark:divide-gray-800">
                                    {reportData.unitsSoldByProduct.map((item) => (
                                        <tr key={item._id}>
                                            <td className="p-4 text-sm font-medium ...">{item._id}</td>
                                            <td className="p-4 text-sm ... text-right">{item.totalUnits}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </article>
                </section>
            )}
        </section>
    );
};

export default DateRangeReport;