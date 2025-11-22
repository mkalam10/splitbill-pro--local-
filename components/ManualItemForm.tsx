import React, { useState } from 'react';
import { Item } from '../types';

interface ManualItemFormProps {
    onAddItem: (item: Omit<Item, 'id' | 'participantIds'>) => void;
    onCancel: () => void;
}

const ManualItemForm: React.FC<ManualItemFormProps> = ({ onAddItem, onCancel }) => {
    const [name, setName] = useState('');
    const [quantity, setQuantity] = useState(1);
    const [price, setPrice] = useState(0);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (name.trim() && quantity > 0 && price > 0) {
            onAddItem({ name, quantity, price });
        }
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50 p-4">
            <form onSubmit={handleSubmit} className="bg-white rounded-xl p-6 shadow-2xl w-full max-w-sm animate-fade-in-up">
                <h3 className="text-xl font-bold text-green-600 mb-6">Add New Item</h3>
                <div className="space-y-4">
                    <div>
                        <label htmlFor="itemName" className="block text-sm font-medium text-gray-600 mb-1">Item Name</label>
                        <input id="itemName" type="text" value={name} onChange={e => setName(e.target.value)} className="w-full bg-gray-50 border border-gray-300 rounded-lg px-3 py-2 text-gray-800 focus:outline-none focus:ring-2 focus:ring-green-500" required />
                    </div>
                    <div>
                        <label htmlFor="itemQuantity" className="block text-sm font-medium text-gray-600 mb-1">Quantity</label>
                        <input id="itemQuantity" type="number" min="1" value={quantity} onChange={e => setQuantity(parseInt(e.target.value, 10))} className="w-full bg-gray-50 border border-gray-300 rounded-lg px-3 py-2 text-gray-800 focus:outline-none focus:ring-2 focus:ring-green-500" required />
                    </div>
                    <div>
                        <label htmlFor="itemPrice" className="block text-sm font-medium text-gray-600 mb-1">Price per Item</label>
                        <input id="itemPrice" type="number" min="0" value={price} onChange={e => setPrice(parseFloat(e.target.value))} className="w-full bg-gray-50 border border-gray-300 rounded-lg px-3 py-2 text-gray-800 focus:outline-none focus:ring-2 focus:ring-green-500" required />
                    </div>
                </div>
                <div className="flex gap-2 mt-6">
                    <button type="button" onClick={onCancel} className="flex-1 bg-gray-200 hover:bg-gray-300 text-gray-800 font-bold py-2 px-4 rounded-lg transition-colors">Cancel</button>
                    <button type="submit" className="flex-1 bg-green-500 hover:bg-green-600 text-white font-bold py-2 px-4 rounded-lg transition-colors">Add Item</button>
                </div>
            </form>
        </div>
    );
};

export default ManualItemForm;