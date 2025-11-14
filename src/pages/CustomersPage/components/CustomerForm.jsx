import React, { useState } from 'react';

const CustomerForm = ({ customer, onSubmit, onCancel }) => {
    // Inicializamos el estado basado en el prop 'customer'
    const [formData, setFormData] = useState(() => {
        if (customer) {
            // Editando
            return {
                name: customer.name,
                phone: customer.phone || '',
                address: customer.address || '',
                notes: customer.notes || '',
            };
        } else {
            // Creando
            return { name: '', phone: '', address: '', notes: '' };
        }
    });

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({
            ...prev,
            [name]: value,
        }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        onSubmit(formData); // Enviamos los datos al componente padre
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-6">
            <label className="flex flex-col w-full">
                <span className="... text-sm font-medium pb-2">Nombre del Cliente</span>
                <input
                    name="name"
                    type="text"
                    value={formData.name}
                    onChange={handleChange}
                    required
                    placeholder="Ej: Nombre Apellido"
                    className="form-input ... h-12 ..."
                />
            </label>

            <label className="flex flex-col w-full">
                <span className="... text-sm font-medium pb-2">Teléfono (Opcional)</span>
                <input
                    name="phone"
                    type="tel"
                    value={formData.phone}
                    onChange={handleChange}
                    placeholder="Ej: 3001234567"
                    className="form-input ... h-12 ..."
                />
            </label>

            <label className="flex flex-col w-full">
                <span className="... text-sm font-medium pb-2">Dirección (Opcional)</span>
                <input
                    name="address"
                    type="text"
                    value={formData.address}
                    onChange={handleChange}
                    placeholder="Ej: Calle Falsa 123"
                    className="form-input ... h-12 ..."
                />
            </label>

            <label className="flex flex-col w-full">
                <span className="... text-sm font-medium pb-2">Notas (Opcional)</span>
                <textarea
                    name="notes"
                    value={formData.notes}
                    onChange={handleChange}
                    placeholder="Ej: Paga los Lunes"
                    className="form-textarea ... "
                    rows="3"
                ></textarea>
            </label>

            <footer className="flex justify-end gap-4 pt-4">
                <button
                    type="button"
                    onClick={onCancel}
                    className="flex min-w-[84px] cursor-pointer items-center justify-center rounded-lg h-10 px-4 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 text-sm font-bold transition-colors hover:bg-gray-50 dark:hover:bg-gray-700"
                >
                    Cancelar
                </button>
                <button
                    type="submit"
                    className="flex min-w-[84px] cursor-pointer items-center justify-center rounded-lg h-10 px-4 bg-primary text-white text-sm font-bold transition-colors hover:bg-primary/90"
                >
                    Guardar
                </button>
            </footer>
        </form>
    );
};

export default CustomerForm;