import React, { useState, useEffect } from 'react';
import { getProducts } from '../../../services/products.service';
import { getCustomers } from '../../../services/customers.service';
import { createSale } from '../../../services/sales.service';

const currencyFormatter = new Intl.NumberFormat('es-CO', {
    style: 'currency',
    currency: 'COP',
    maximumFractionDigits: 0,
});

// Componente principal del formulario
const NewSaleForm = () => {
    const [products, setProducts] = useState([]);
    const [customers, setCustomers] = useState([]);
    const [cart, setCart] = useState([]); // El "carrito de compras"
    const [saleData, setSaleData] = useState({
        customerId: '',
        amountPaid: 0,
        paymentMethod: 'Efectivo', // Valor por defecto
    });
    const [currentItem, setCurrentItem] = useState({
        productId: '',
        quantity: 1,
    });
    const [currentFormat, setCurrentFormat] = useState('unidad');

    // --- Carga de Datos (Dropdowns) ---
    useEffect(() => {
        const loadDropdowns = async () => {
            const [productsData, customersData] = await Promise.all([
                getProducts(),
                getCustomers(),
            ]);
            setProducts(productsData);
            setCustomers(customersData);
            // Setea el primer cliente y producto por defecto si existen
            if (customersData.length > 0) {
                setSaleData(prev => ({ ...prev, customerId: customersData[0]._id }));
            }
            if (productsData.length > 0) {
                setCurrentItem(prev => ({ ...prev, productId: productsData[0]._id }));
            }
        };
        loadDropdowns();
    }, []);

    // --- Lógica del Carrito (CORREGIDA) ---
    const handleAddItemToCart = () => {
        if (!currentItem.productId || currentItem.quantity <= 0) {
            alert('Selecciona un producto y una cantidad válida.');
            return;
        }

        const product = products.find(p => p._id === currentItem.productId);
        if (!product) return;

        const qty = Number(currentItem.quantity); // Cantidad de "formatos" (ej. 2 cartones)
        let itemToAdd;

        // --- Lógica de lineTotal (para evitar decimales y NaN) ---
        if (currentFormat === 'paquete') {
            // VALIDACIÓN
            if (!product.packageUnits || product.packageUnits <= 0 || product.packagePrice === undefined || product.packagePrice < 0) {
                alert(`Error: El producto "${product.name}" no tiene un precio de paquete válido (Unidades y Precio) configurado en la sección de Productos.`);
                return; // Detiene la ejecución
            }
            
            itemToAdd = {
                productId: product._id,
                productName: `${product.name} (${product.packageName || 'Paquete'})`,
                // Cantidad total de huevos (ej: 2 * 30 = 60)
                quantity: qty * product.packageUnits,
                // Total de la línea (ej: 2 * 13000 = 26000)
                lineTotal: qty * product.packagePrice, 
            };
        } else {
            // Venta por UNIDAD
            itemToAdd = {
                productId: product._id,
                productName: `${product.name} (Unidad)`,
                // Cantidad total de huevos (ej: 5)
                quantity: qty,
                // Total de la línea (ej: 5 * 450 = 2250)
                lineTotal: qty * product.unitPrice, 
            };
        }

        // --- Lógica de Carrito Corregida (Arregla el bug de 'key' y 'newCart') ---
        const existingItem = cart.find(item => item.productName === itemToAdd.productName);

        let newCart;
        if (existingItem) {
            // Si ya existe, actualiza cantidad y total
            newCart = cart.map(item =>
                item.productName === itemToAdd.productName
                    ? { 
                        ...item, 
                        quantity: item.quantity + itemToAdd.quantity,
                        lineTotal: item.lineTotal + itemToAdd.lineTotal // Suma los totales
                      }
                    : item
            );
        } else {
            // Si no existe, añádelo
            newCart = [...cart, itemToAdd];
        }
        
        // ¡USA newCart y arregla el bug!
        setCart(newCart); 
    };

    const handleRemoveItemFromCart = (productName) => {
        // Elimina por 'productName' que es nuestra 'key' única
        setCart(cart.filter(item => item.productName !== productName));
    };

    // --- Lógica del Formulario ---
    const handleFormChange = (e) => {
        const { name, value } = e.target;
        setSaleData(prev => ({ ...prev, [name]: value }));
    };

    const handleItemChange = (e) => {
        const { name, value } = e.target;
        setCurrentItem(prev => ({ ...prev, [name]: value }));
    };

    // --- Cálculo de Totales (Arregla el NaN) ---
    // Ahora suma los 'lineTotal' que SÍ existen en el carrito
    const totalAmount = cart.reduce((sum, item) => sum + item.lineTotal, 0);
    const amountPending = totalAmount - (Number(saleData.amountPaid) || 0);

    // --- Envío de la Venta (Corregido) ---
    const handleSubmit = async (e) => {
        e.preventDefault();
        if (cart.length === 0) {
            alert('Debes añadir al menos un producto a la venta.');
            return;
        }
        
        // El DTO ahora coincide con lo que el backend espera
        const saleDTO = {
            customerId: saleData.customerId,
            amountPaid: Number(saleData.amountPaid),
            paymentMethod: saleData.paymentMethod,
            items: cart.map(item => ({
                productId: item.productId,
                quantity: item.quantity,
                lineTotal: item.lineTotal,       // <-- ENVIAMOS EL TOTAL
                productName: item.productName,  // <-- ENVIAMOS EL NOMBRE
            })),
        };

        try {
            await createSale(saleDTO);
            alert('¡Venta registrada exitosamente!');
            setCart([]);
            setSaleData({
                customerId: customers[0]?._id || '',
                amountPaid: 0,
                paymentMethod: 'Efectivo',
            });
        } catch (error) {
            alert(`Error al crear la venta: ${error.message || 'Error desconocido'}`);
        }
    };

    // --- Renderizado (HTML Corregido) ---
    return (
        <form onSubmit={handleSubmit} className="mt-6 grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Columna Izquierda: Formulario */}
            <div className="lg:col-span-2 space-y-8">

                {/* Datos Generales */}
                <section className="bg-white dark:bg-gray-900/50 p-6 rounded-xl border border-border-light dark:border-gray-700">
                    <h3 className="text-gray-900 dark:text-white text-lg font-bold mb-4">
                        Datos Generales
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <label className="flex flex-col w-full">
                            <p className="text-gray-800 dark:text-gray-200 text-sm font-medium pb-2">Cliente</p>
                            <select
                                name="customerId"
                                value={saleData.customerId}
                                onChange={handleFormChange}
                                required
                                className="form-select h-12 rounded-lg border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-900/50 text-gray-900 dark:text-white focus:ring-primary/50 focus:border-primary"
                            >
                                {customers.map(c => (
                                    <option key={c._id} value={c._id}>{c.name}</option>
                                ))}
                            </select>
                        </label>
                        <label className="flex flex-col w-full">
                            <p className="text-gray-800 dark:text-gray-200 text-sm font-medium pb-2">Fecha de Venta</p>
                            <input
                                className="form-input h-12 rounded-lg border-gray-300 dark:border-gray-700 bg-gray-100 dark:bg-gray-800/50 text-gray-500 dark:text-gray-400"
                                type="date"
                                value={new Date().toISOString().split('T')[0]} // Fecha de hoy
                                readOnly
                            />
                        </label>
                    </div>
                </section>

                {/* Añadir Productos */}
                <section className="bg-white dark:bg-gray-900/50 p-6 rounded-xl border border-border-light dark:border-gray-700">
                    <h3 className="text-gray-900 dark:text-white text-lg font-bold mb-4">
                        Añadir Productos
                    </h3>
                    <div className="flex flex-col md:flex-row items-end gap-4">
                        <label className="flex flex-col w-full flex-1">
                            <p className="text-sm font-medium pb-2 text-gray-800 dark:text-gray-200">Producto</p>
                            <select
                                name="productId"
                                value={currentItem.productId}
                                onChange={handleItemChange}
                                className="form-select h-12 rounded-lg border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-900/50 text-gray-900 dark:text-white focus:ring-primary/50 focus:border-primary"
                            >
                                {products.map(p => (
                                    <option key={p._id} value={p._id}>{p.name} ({currencyFormatter.format(p.unitPrice)}/un)</option>
                                ))}
                            </select>
                        </label>

                        <label className="flex flex-col w-full md:w-48">
                            <p className="text-sm font-medium pb-2 text-gray-800 dark:text-gray-200">Formato</p>
                            <select
                                name="format"
                                value={currentFormat}
                                onChange={(e) => setCurrentFormat(e.target.value)}
                                className="form-select h-12 rounded-lg border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-900/50 text-gray-900 dark:text-white focus:ring-primary/50 focus:border-primary"
                            >
                                <option value="unidad">Unidad</option>
                                {products.find(p => p._id === currentItem.productId)?.packagePrice > 0 && (
                                    <option value="paquete">
                                        {products.find(p => p._id === currentItem.productId).packageName || 'Paquete'}
                                    </option>
                                )}
                            </select>
                        </label>

                        <label className="flex flex-col w-full md:w-32">
                            <p className="text-sm font-medium pb-2 text-gray-800 dark:text-gray-200">Cantidad</p>
                            <input
                                name="quantity"
                                type="number"
                                min="1"
                                value={currentItem.quantity}
                                onChange={handleItemChange}
                                className="form-input h-12 rounded-lg border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-900/50 text-gray-900 dark:text-white focus:ring-primary/50 focus:border-primary"
                            />
                        </label>
                        <button
                            type="button"
                            onClick={handleAddItemToCart}
                            className="bg-primary/20 text-primary h-12 px-6 rounded-lg text-sm font-bold flex items-center justify-center gap-2 w-full md:w-auto transition-colors hover:bg-primary/30"
                        >
                            <span className="material-symbols-outlined">add_shopping_cart</span>
                            <span>Añadir</span>
                        </button>
                    </div>

                    {/* Carrito */}
                    <div className="mt-6 flow-root">
                        <ul className="-my-4 divide-y divide-gray-200 dark:divide-gray-800">
                            {cart.map(item => (
                                // ¡KEY CORREGIDA! Usa productName que es único
                                <li key={item.productName} className="flex items-center py-4">
                                    <div className="flex-1">
                                        <p className="text-gray-900 dark:text-white font-medium">{item.productName}</p>
                                        <p className="text-sm text-gray-500 dark:text-gray-400">
                                            {item.quantity} unidades
                                        </p>
                                    </div>
                                    <div className="flex items-center gap-4">
                                        <p className="font-semibold text-gray-900 dark:text-white">
                                            {/* ¡TOTAL CORREGIDO! Muestra el lineTotal */}
                                            {currencyFormatter.format(item.lineTotal)}
                                        </p>
                                        <button type="button" onClick={() => handleRemoveItemFromCart(item.productName)} className="text-gray-400 hover:text-red-500">
                                            <span className="material-symbols-outlined text-xl">delete</span>
                                        </button>
                                    </div>
                                </li>
                            ))}
                        </ul>
                    </div>
                </section>
            </div>

            {/* Columna Derecha: Resumen y Pago */}
            <aside className="lg:col-span-1">
                <div className="sticky top-10 bg-white dark:bg-gray-900/50 p-6 rounded-xl border border-border-light dark:border-gray-700 space-y-6">
                    <h3 className="text-gray-900 dark:text-white text-lg font-bold">Resumen y Pago</h3>

                    <div className="space-y-2 border-b border-gray-200 dark:border-gray-800 pb-4">
                        <div className="flex justify-between font-bold text-lg">
                            <p className="text-gray-900 dark:text-white">Total</p>
                            {/* ¡TOTAL CORREGIDO! Usa la variable totalAmount (que ya no es NaN) */}
                            <p className="text-gray-900 dark:text-white">{currencyFormatter.format(totalAmount)}</p>
                        </div>
                    </div>

                    <div className="space-y-4">
                        <label className="flex flex-col w-full">
                            <p className="text-sm font-medium pb-2 text-gray-800 dark:text-gray-200">Monto Pagado</p>
                            <input
                                name="amountPaid"
                                type="number"
                                min="0"
                                max={totalAmount || 0} // Asegura que max nunca sea NaN
                                value={saleData.amountPaid}
                                onChange={handleFormChange}
                                className="form-input h-12 rounded-lg border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-900/50 text-gray-900 dark:text-white focus:ring-primary/50 focus:border-primary"
                            />
                        </label>

                        <div className={`flex justify-between p-3 rounded-lg ${amountPending > 0 ? 'bg-red-50 dark:bg-red-900/20' : 'bg-green-50 dark:bg-green-900/20'}`}>
                            <p className={`text-sm font-medium ${amountPending > 0 ? 'text-red-600 dark:text-red-400' : 'text-green-600 dark:text-green-400'}`}>
                                Monto Pendiente
                            </p>
                            <p className={`text-sm font-bold ${amountPending > 0 ? 'text-red-600 dark:text-red-400' : 'text-green-600 dark:text-green-400'}`}>
                                {currencyFormatter.format(amountPending)}
                            </p>
                        </div>

                        <div>
                            <p className="text-sm font-medium pb-2 text-gray-800 dark:text-gray-200">Método de Pago</p>
                            <select
                                name="paymentMethod"
                                value={saleData.paymentMethod}
                                onChange={handleFormChange}
                                className="form-select h-12 w-full rounded-lg border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-900/50 text-gray-900 dark:text-white focus:ring-primary/50 focus:border-primary"
                            >
                                <option>Efectivo</option>
                                <option>Nequi</option>
                                <option>Bancolombia</option>
                                <option>Otro</option>
                            </select>
                        </div>
                    </div>

                    <div className="flex flex-col gap-3 pt-4">
                        <button
                            type="submit"
                            className="w-full bg-primary text-white font-bold h-12 rounded-lg flex items-center justify-center gap-2 transition-colors hover:bg-primary/90"
                        >
                            <span className="material-symbols-outlined">save</span>
                            Guardar Venta
                        </button>
                    </div>
                </div>
            </aside>
        </form>
    );
};

export default NewSaleForm;