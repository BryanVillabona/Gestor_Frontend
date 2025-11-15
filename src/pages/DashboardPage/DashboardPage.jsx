import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom'; // Para los botones de acceso rápido

// 1. Importamos nuestros servicios y componentes
import {
    getDashboardKPIs,
    getTotalPortfolio,
    getInventoryAlerts,
} from '../../services/reports.service';
import KpiCard from './components/KpiCard';
import AlertsTable from './components/AlertsTable';

const DashboardPage = () => {
    // 2. Estados para guardar la data del backend
    const [kpis, setKpis] = useState({
        totalSalesToday: 0,
        totalIncomeToday: 0,
        totalIncomeMonth: 0,
    });
    const [portfolio, setPortfolio] = useState(0);
    const [alerts, setAlerts] = useState([]);
    const [isLoading, setIsLoading] = useState(true); // Para un estado de carga

    // 3. useEffect para cargar los datos cuando el componente se monta
    useEffect(() => {
        // Definimos una función async interna para cargar todo
        const loadDashboardData = async () => {
            try {
                setIsLoading(true);
                // Hacemos las llamadas a la API en paralelo
                const [kpiData, portfolioData, alertsData] = await Promise.all([
                    getDashboardKPIs(),
                    getTotalPortfolio(),
                    getInventoryAlerts(),
                ]);

                setKpis(kpiData);
                setPortfolio(portfolioData.totalPortfolio);
                setAlerts(alertsData);

            } catch (error) {
                console.error('Error al cargar el dashboard:', error);
            } finally {
                setIsLoading(false);
            }
        };

        loadDashboardData();
    }, []); // El array vacío [] asegura que esto solo se ejecute una vez

    // Opcional: Mostrar un mensaje de carga
    if (isLoading) {
        return (
            <section>
                <h1 className="text-4xl font-black">Dashboard</h1>
                <p className="text-lg">Cargando datos...</p>
            </section>
        );
    }

    // 4. Renderizamos el HTML del Mockup con nuestra data
    return (
        // HTML Semántico: <section> para el dashboard
        <section className="flex flex-col gap-8">
            <header>
                <h1 className="text-[#111518] dark:text-white text-4xl font-black leading-tight tracking-[-0.033em]">
                    Resumen del Día
                </h1>
                <p className="text-gray-500 dark:text-gray-400 text-base font-normal leading-normal">
                    Una vista rápida del estado de tu negocio.
                </p>
            </header>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                <KpiCard
                    title="Ventas de Hoy"
                    value={kpis.totalSalesToday}
                    icon="payments"
                />
                <KpiCard
                    title="Ingreso de Hoy"
                    value={kpis.totalIncomeToday}
                    icon="trending_up"
                />
                <KpiCard
                    title="Ingreso del Mes"
                    value={kpis.totalIncomeMonth}
                    icon="calendar_month"
                />
                <KpiCard
                    title="Cartera Total"
                    value={portfolio}
                    icon="account_balance_wallet"
                />
            </div>

            {/* Botones CTA (AHORA RESPONSIVE) */}
            <nav className="flex flex-col sm:flex-row gap-4 p-4">
                <Link
                    to="/ventas"
                    className="flex flex-1 items-center justify-center gap-2 rounded-xl bg-primary py-4 px-6 text-base font-bold text-white shadow-md transition-all hover:bg-primary/90 active:scale-95"
                >
                    <span className="material-symbols-outlined text-2xl">add_shopping_cart</span>
                    <span>Registrar Nueva Venta</span>
                </Link>
                <Link
                    to="/productos"
                    className="flex flex-1 items-center justify-center gap-2 rounded-xl bg-verde-stock py-4 px-6 text-base font-bold text-white shadow-md transition-all hover:opacity-90 active:scale-95"
                >
                    <span className="material-symbols-outlined text-2xl">inventory</span>
                    <span>Registrar Entrada</span>
                </Link>
            </nav>

            {/* Sección de Alertas de Inventario */}
            <section>
                <h2 className="text-[#111518] dark:text-white text-[22px] font-bold tracking-[-0.015em] px-4 pb-3 pt-5">
                    Alertas de Inventario (Stock bajo)
                </h2>
                <AlertsTable alerts={alerts} />
            </section>
        </section>
    );
};

export default DashboardPage;