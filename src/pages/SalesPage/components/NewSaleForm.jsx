import React, { useState, useEffect } from 'react';
import { toast } from 'react-hot-toast';
import { getProducts } from '../../../services/products.service';
import { getCustomers } from '../../../services/customers.service';
import { createSale } from '../../../services/sales.service';
import { getInventory } from '../../../services/inventory.service';

const getLocalDate = () => {
    const now = new Date();
    // Restamos el offset de la zona horaria para obtener la fecha local en formato ISO
    const offset = now.getTimezoneOffset() * 60000;
    const localDate = new Date(now.getTime() - offset);
    return localDate.toISOString().split('T')[0];
};

const currencyFormatter = new Intl.NumberFormat('es-CO', {
    style: 'currency',
    currency: 'COP',
    maximumFractionDigits: 0,
});

// Componente principal del formulario
const NewSaleForm = () => {
    const [products, setProducts] = useState([]);
    const [customers, setCustomers] = useState([]);
    const [inventory, setInventory] = useState([]);
    const [cart, setCart] = useState([]);

    // --- ESTADOS NUEVOS ---
    const [saleType, setSaleType] = useState('mostrador'); // 'mostrador' o 'cliente'
    const [genericCustomerId, setGenericCustomerId] = useState(null); // ID de "Cliente Varios"
    // --- FIN ESTADOS NUEVOS ---

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
            const [productsData, customersData, inventoryData] = await Promise.all([
                getProducts(),
                getCustomers(),
                getInventory()
            ]);
            setProducts(productsData);
            setCustomers(customersData);
            setInventory(inventoryData);

            // Lógica para encontrar 'Cliente Varios'
            const genericCustomer = customersData.find(c => c.name.toLowerCase() === 'cliente varios');
            
            if (genericCustomer) {
                setGenericCustomerId(genericCustomer._id);
                // Asignar customerId por defecto basado en el saleType INICIAL ('mostrador')
                setSaleData(prev => ({ ...prev, customerId: genericCustomer._id }));
            } else {
                toast.error("¡ACCIÓN REQUERIDA! Debes crear un cliente llamado 'Cliente Varios'", { duration: 6000 });
            }

            if (productsData.length > 0) {
                setCurrentItem(prev => ({ ...prev, productId: productsData[0]._id }));
            }
        };
        loadDropdowns();
    }, []); // El array vacío [] asegura que se ejecute solo una vez


    // --- LÓGICA CORREGIDA: Manejador de evento ---
    // Esto se ejecuta SÓLO cuando el usuario hace clic en el botón de tipo de venta.
    const handleSaleTypeChange = (newType) => {
        setSaleType(newType); // 1. Setear el tipo

        if (newType === 'mostrador') {
            // 2. Si es mostrador, setea el cliente genérico y resetea el pago
            setSaleData(prev => ({
                ...prev,
                customerId: genericCustomerId, // Asigna ID genérico
                amountPaid: 0 // Resetea. El render se encargará de mostrar el total
            }));
        } else {
            // 3. Si es cliente, busca el primer cliente REAL y resetea el pago
            const firstRealCustomer = customers.find(c => c._id !== genericCustomerId);
            setSaleData(prev => ({
                ...prev,
                customerId: firstRealCustomer ? firstRealCustomer._id : '', // Asigna primer real
                amountPaid: 0 // Resetea para gestión de cartera
            }));
        }
    };
    // --- FIN LÓGICA CORREGIDA ---


    // --- Lógica del Carrito (Sin cambios, ya estaba bien) ---
    const handleAddItemToCart = () => {
        if (!currentItem.productId || currentItem.quantity <= 0) {
            toast.error('Selecciona un producto y una cantidad válida.');
            return;
        }

        const product = products.find(p => p._id === currentItem.productId);
        if (!product) return;

        const qty = Number(currentItem.quantity);
        let quantityToSell; 

        if (currentFormat === 'paquete') {
            if (!product.packageUnits || product.packageUnits <= 0 || product.packagePrice === undefined || product.packagePrice < 0) {
                toast.error(`Error: El producto "${product.name}" no tiene un precio de paquete válido...`);
                return;
            }
            quantityToSell = qty * product.packageUnits;
        
        } else {
            quantityToSell = qty;
        }

        const inventoryItem = inventory.find(item => item.productId?._id === product._id);
        const currentStock = inventoryItem ? inventoryItem.currentStock : 0;

        let quantityAlreadyInCart = 0;
        cart.forEach(item => {
            if (item.productId === product._id) {
                quantityAlreadyInCart += item.quantity;
            }
        });

        if ((quantityToSell + quantityAlreadyInCart) > currentStock) {
            toast.error(
                `¡Stock insuficiente para "${product.name}"!\nStock: ${currentStock}u. | En Carrito: ${quantityAlreadyInCart}u.`
            );
            return;
        }
        
        let itemToAdd;
        if (currentFormat === 'paquete') {
            itemToAdd = {
                productId: product._id,
                productName: `${product.name} (${product.packageName || 'Paquete'})`,
                quantity: quantityToSell,
                lineTotal: qty * product.packagePrice, 
            };
        } else {
            itemToAdd = {
                productId: product._id,
                productName: `${product.name} (Unidad)`,
                quantity: quantityToSell,
                lineTotal: qty * product.unitPrice, 
            };
        }

        const existingItem = cart.find(item => item.productName === itemToAdd.productName);
        let newCart;
        if (existingItem) {
            newCart = cart.map(item =>
                item.productName === itemToAdd.productName
                    ? { 
                        ...item, 
                        quantity: item.quantity + itemToAdd.quantity,
                        lineTotal: item.lineTotal + itemToAdd.lineTotal
                      }
                    : item
            );
        } else {
            newCart = [...cart, itemToAdd];
        }
        
        setCart(newCart); 
    };
    
    const handleRemoveItemFromCart = (productName) => {
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


    // --- CÁLCULO DE TOTALES (LÓGICA CORREGIDA) ---
    // Se calculan estas variables en CADA RENDER. Esto es lo correcto.
    const totalAmount = cart.reduce((sum, item) => sum + item.lineTotal, 0);
    const isMostrador = saleType === 'mostrador';
    
    // El monto pagado "efectivo" se CALCULA, no se guarda en state
    const effectiveAmountPaid = isMostrador ? totalAmount : (Number(saleData.amountPaid) || 0);
    
    // El cliente "efectivo" se CALCULA
    const effectiveCustomerId = isMostrador ? genericCustomerId : saleData.customerId;

    // El pendiente se calcula sobre el monto efectivo
    const amountPending = totalAmount - effectiveAmountPaid;
    // --- FIN CÁLCULO DE TOTALES ---


    // --- Envío de la Venta (Corregido) ---
    const handleSubmit = async (e) => {
        e.preventDefault();
        if (cart.length === 0) {
            toast.error('Debes añadir al menos un producto a la venta.');
            return;
        }
        
        // --- Validaciones antes de enviar ---
        if (isMostrador && !genericCustomerId) {
            toast.error("No se puede registrar. Falta configurar el 'Cliente Varios'.");
            return;
        }
        if (!isMostrador && !effectiveCustomerId) { // Usa effectiveId
            toast.error('Por favor, selecciona un cliente para la venta a cartera.');
            return;
        }

        const saleDTO = {
            customerId: effectiveCustomerId,  // <-- USA EFECTIVO
            amountPaid: effectiveAmountPaid, // <-- USA EFECTIVO
            paymentMethod: saleData.paymentMethod,
            items: cart.map(item => ({
                productId: item.productId,
                quantity: item.quantity,
                lineTotal: item.lineTotal,
                productName: item.productName,
            })),
        };

        try {
            await createSale(saleDTO);
            toast.success('¡Venta registrada exitosamente!');
            setCart([]); // Esto setea totalAmount a 0

            // --- MODIFICADO: Resetear formulario ---
            if (isMostrador) {
                setSaleData({
                    customerId: genericCustomerId, // Re-selecciona cliente genérico
                    amountPaid: 0, // El carrito es 0, el total es 0, el pago es 0
                    paymentMethod: 'Efectivo',
                });
            } else {
                // Resetear a "Venta Cliente"
                const firstRealCustomer = customers.find(c => c._id !== genericCustomerId);
                setSaleData({
                    customerId: firstRealCustomer ? firstRealCustomer._id : '',
                    amountPaid: 0,
                    paymentMethod: 'Efectivo',
                });
            }
            // --- FIN MODIFICADO ---

            // Recargar inventario
            const inventoryData = await getInventory();
            setInventory(inventoryData);
            
        } catch (error) {
            console.error('Objeto de error detallado:', error);
            let errorMessage = 'Error desconocido';
            if (error.details) { 
                errorMessage = error.details.join(', ');
            } else if (error.error) { 
                errorMessage = error.error;
            } else if (error.message) { 
                errorMessage = error.message;
            }
            toast.error(`Error al crear la venta: ${errorMessage}`);
        }
    };

    // --- Renderizado (HTML Corregido) ---
    return (
        <form onSubmit={handleSubmit} className="mt-6 grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Columna Izquierda: Formulario */}
            <div className="lg:col-span-2 space-y-8">

                {/* --- NUEVO: Toggle de Tipo de Venta --- */}
                <div className="flex w-full max-w-sm rounded-lg bg-gray-200 dark:bg-gray-800 p-1">
                    <button
                        type="button"
                        onClick={() => handleSaleTypeChange('mostrador')} // <-- USA EL HANDLER
                        className={`w-1/2 rounded-md py-2 text-sm font-bold transition-all ${
                            saleType === 'mostrador'
                            ? 'bg-white dark:bg-gray-700 text-primary shadow-sm'
                            : 'text-gray-500 hover:bg-white/50 dark:hover:bg-gray-700/50'
                        }`}
                    >
                        Venta de Mostrador
                    </button>
                    <button
                        type="button"
                        onClick={() => handleSaleTypeChange('cliente')} // <-- USA EL HANDLER
                        className={`w-1/2 rounded-md py-2 text-sm font-bold transition-all ${
                            saleType === 'cliente'
                            ? 'bg-white dark:bg-gray-700 text-primary shadow-sm'
                            : 'text-gray-500 hover:bg-white/50 dark:hover:bg-gray-700/50'
                        }`}
                    >
                        Venta a Cliente (Cartera)
                    </button>
                </div>
                {/* --- FIN NUEVO --- */}

                {/* Datos Generales */}
                <section className="bg-white dark:bg-gray-900/50 p-6 rounded-xl border border-border-light dark:border-gray-700">
                    <h3 className="text-gray-900 dark:text-white text-lg font-bold mb-4">
                        Datos Generales
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        
                        {/* --- MODIFICADO: Dropdown Condicional de Cliente --- */}
                        {isMostrador ? (
                            <label className="flex flex-col w-full">
                                <p className="text-gray-800 dark:text-gray-200 text-sm font-medium pb-2">Cliente</p>
                                <input
                                    type="text"
                                    readOnly
                                    disabled
                                    value="Cliente Varios" // Muestra "Cliente Varios"
                                    className="form-input h-12 rounded-lg border-gray-300 dark:border-gray-700 bg-gray-100 dark:bg-gray-800/50 text-gray-500 dark:text-gray-400"
                                />
                            </label>
                        ) : (
                            <label className="flex flex-col w-full">
                                <p className="text-gray-800 dark:text-gray-200 text-sm font-medium pb-2">Cliente</p>
                                <select
                                    name="customerId"
                                    value={saleData.customerId} // Controlado por el state
                                    onChange={handleFormChange}
                                    required
                                    className="form-select h-12 rounded-lg border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-900/50 text-gray-900 dark:text-white focus:ring-primary/50 focus:border-primary"
                                >
                                    <option value="">Selecciona un cliente...</option>
                                    {customers
                                        .filter(c => c._id !== genericCustomerId) // Oculta "Cliente Varios"
                                        .map(c => (
                                            <option key={c._id} value={c._id}>{c.name}</option>
                                        ))}
                                </select>
                            </label>
                        )}
                        {/* --- FIN MODIFICADO --- */}

                        <label className="flex flex-col w-full">
                            <p className="text-gray-800 dark:text-gray-200 text-sm font-medium pb-2">Fecha de Venta</p>
                            <input
                                className="form-input h-12 rounded-lg border-gray-300 dark:border-gray-700 bg-gray-100 dark:bg-gray-800/50 text-gray-500 dark:text-gray-400"
                                type="date"
                                value={getLocalDate()}
                                readOnly
                            />
                        </label>
                    </div>
                </section>

                {/* Añadir Productos (Sin cambios en esta sección) */}
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
                                step="1"
                                min="1"
                                value={currentItem.quantity}
                                onChange={handleItemChange}
                                className="form-input h-12 rounded-lg border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-900/50 text-gray-900 dark:text-white focus:ring-primary/50 focus:border-primary"
                            />
                        </label>
                        <div className="flex flex-col w-full md:w-auto">
                            <p className="text-sm font-medium pb-2 invisible">Añadir</p>
                            <button
                                type="button"
                                onClick={handleAddItemToCart}
                                className="bg-primary/20 text-primary h-12 px-6 rounded-lg text-sm font-bold flex items-center justify-center gap-2 w-full md:w-auto transition-colors hover:bg-primary/30"
                            >
                                <span className="material-symbols-outlined">add_shopping_cart</span>
                                <span>Añadir</span>
                            </button>
                        </div>
                    </div>

                    {/* Carrito (Sin cambios) */}
                    <div className="mt-6 flow-root">
                        <ul className="-my-4 divide-y divide-gray-200 dark:divide-gray-800">
                            {cart.map(item => (
                                <li key={item.productName} className="flex items-center py-4">
                                    <div className="flex-1">
                                        <p className="text-gray-900 dark:text-white font-medium">{item.productName}</p>
                                        <p className="text-sm text-gray-500 dark:text-gray-400">
                                            {item.quantity} unidades
                                        </p>
                                    </div>
                                    <div className="flex items-center gap-4">
                                        <p className="font-semibold text-gray-900 dark:text-white">
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
                                max={totalAmount || 0}
                                // --- MODIFICADO: Muestra el valor efectivo ---
                                value={effectiveAmountPaid} 
                                onChange={handleFormChange}
                                // --- MODIFICADO: Deshabilitar si es venta de mostrador ---
                                disabled={isMostrador}
                                className="form-input h-12 rounded-lg border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-900/50 text-gray-900 dark:text-white focus:ring-primary/50 focus:border-primary disabled:bg-gray-100 disabled:text-gray-500 dark:disabled:bg-gray-800/50"
                            />
                        </label>

                        <div className={`flex justify-between p-3 rounded-lg ${amountPending > 0 ? 'bg-red-50 dark:bg-red-900/20' : 'bg-green-50 dark:bg-green-900/20'}`}>
                            <p className={`text-sm font-medium ${amountPending > 0 ? 'text-red-600 dark:text-red-400' : 'text-green-600 dark:text-green-400'}`}>
                                Monto Pendiente
                            </p>
                            <p className={`text-sm font-bold ${amountPending > 0 ? 'text-red-600 dark:text-red-400' : 'text-green-600 dark:text-green-400'}`}>
                                {/* --- MODIFICADO: Muestra el pendiente efectivo --- */}
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
                            // --- MODIFICADO: Lógica de deshabilitar botón ---
                            disabled={
                                (isMostrador && !genericCustomerId) || // No se puede vender si no hay cliente genérico
                                (!isMostrador && !effectiveCustomerId) // No se puede vender si no hay cliente seleccionado
                            }
                            className="w-full bg-primary text-white font-bold h-12 rounded-lg flex items-center justify-center gap-2 transition-colors hover:bg-primary/90 disabled:opacity-50 disabled:cursor-not-allowed"
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