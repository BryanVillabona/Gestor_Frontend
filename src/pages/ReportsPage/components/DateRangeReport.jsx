import React, { useState } from 'react';
import { toast } from 'react-hot-toast';
// 1. Importamos la nueva función del servicio
import { getSalesByDateRange, exportSalesToExcel } from '../../../services/reports.service';

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
    
    // 2. NUEVO ESTADO: Carga independiente para el botón de Excel
    const [isDownloading, setIsDownloading] = useState(false);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setDates(prev => ({ ...prev, [name]: value }));
    };

    // Este es tu manejador actual (Ver en pantalla)
    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            setIsLoading(true);
            setReportData(null); // Limpia el reporte anterior
            const data = await getSalesByDateRange(dates.startDate, dates.endDate);
            setReportData(data);
        } catch (error) {
            toast.error(`Error al generar reporte: ${error.message || 'Error'}`);
        } finally {
            setIsLoading(false);
        }
    };

    // 3. NUEVO MANEJADOR: Para el botón de descarga
    const handleExport = async () => {
        try {
            setIsDownloading(true);
            toast.loading('Generando tu reporte Excel... espera un momento', {
                id: 'excel-toast', // ID para que los toasts no se acumulen
            });

            await exportSalesToExcel(dates.startDate, dates.endDate);

            toast.success('¡Reporte en camino! Revisa tus descargas.', {
                id: 'excel-toast',
            });

        } catch (error) {
            toast.error(`Error al exportar: ${error.message}`, {
                id: 'excel-toast',
            });
        } finally {
            setIsDownloading(false);
        }
    };

    return (
        <section className="flex flex-col gap-8">
            {/* 1. Sección de Generación de Reporte (Formulario) */}
            <article className="bg-white dark:bg-gray-900/50 p-6 rounded-xl border border-gray-200 dark:border-gray-800">
                <h2 className="text-gray-900 dark:text-white text-[22px] font-bold ... mb-4">
                    Reporte de Ventas por Período
                </h2>
                
                {/* 4. MODIFICACIÓN: Agrupamos los botones */}
                <div className="flex flex-col md:flex-row md:items-end gap-4">
                    
                    {/* El formulario ahora es flexible */}
                    <form onSubmit={handleSubmit} className="flex flex-col md:flex-row md:items-end gap-4 flex-1">
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
                            disabled={isLoading || isDownloading} // Se deshabilita con ambas cargas
                            className="flex min-w-[84px] cursor-pointer items-center justify-center overflow-hidden rounded-lg h-12 px-5 bg-primary text-white text-base font-bold leading-normal tracking-[0.015em] transition-colors hover:bg-primary/90 disabled:opacity-50"
                        >
                            {isLoading ? 'Consultando...' : 'Ver en Pantalla'}
                        </button>
                    </form>
                    
                    {/* 5. NUEVO BOTÓN DE EXCEL (Fuera del form) */}
                    <button
                        type="button"
                        onClick={handleExport}
                        disabled={isDownloading || isLoading} // Se deshabilita con ambas cargas
                        className="flex min-w-[84px] cursor-pointer items-center justify-center overflow-hidden rounded-lg h-12 px-5 bg-verde-stock text-white text-base font-bold leading-normal tracking-[0.015em] transition-colors hover:bg-opacity-90 disabled:opacity-50"
                    >
                        <span className="material-symbols-outlined mr-2">download</span>
                        {isDownloading ? 'Generando...' : 'Descargar Excel'}
                    </button>
                </div>
            </article>

            {/* 2. Sección de Resultados (No cambia nada aquí) */}
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