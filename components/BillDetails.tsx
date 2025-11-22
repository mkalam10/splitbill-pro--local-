import React, { useState, useCallback } from 'react';
import { Bill, Item, Participant, Extra, ExtraType, ExtraMode, ExtraSplitMode, BillCalculation } from '../types';
import OcrScanner from './OcrScanner';
import SummaryView from './SummaryView';
import ManualItemForm from './ManualItemForm';
import ExtrasForm from './ExtrasForm';

interface BillDetailsProps {
    bill: Bill;
    updateBill: (updatedBill: Bill) => void;
    billCalculation: BillCalculation | null;
}

type ActiveModal = 'item' | 'extra' | 'ocr' | null;

const BillDetails: React.FC<BillDetailsProps> = ({ bill, updateBill, billCalculation }) => {
    const [activeModal, setActiveModal] = useState<ActiveModal>(null);

    const addItem = (item: Omit<Item, 'id' | 'participantIds'>) => {
        const newItem: Item = {
            ...item,
            id: Date.now().toString(),
            participantIds: [],
        };
        updateBill({ ...bill, items: [...bill.items, newItem] });
        setActiveModal(null);
    };

    const addItemsFromOcr = (ocrItems: Omit<Item, 'id' | 'participantIds'>[]) => {
        const newItems: Item[] = ocrItems.map(item => ({
            ...item,
            id: Date.now().toString() + item.name,
            participantIds: [],
        }));
        updateBill({ ...bill, items: [...bill.items, ...newItems] });
        setActiveModal(null);
    }

    const addExtra = (extra: Omit<Extra, 'id'>) => {
        const newExtra: Extra = { ...extra, id: Date.now().toString() };
        updateBill({ ...bill, extras: [...bill.extras, newExtra] });
        setActiveModal(null);
    };

    const toggleItemParticipant = (itemId: string, participantId: string) => {
        const updatedItems = bill.items.map(item => {
            if (item.id === itemId) {
                const participantIds = item.participantIds.includes(participantId)
                    ? item.participantIds.filter(id => id !== participantId)
                    : [...item.participantIds, participantId];
                return { ...item, participantIds };
            }
            return item;
        });
        updateBill({ ...bill, items: updatedItems });
    };

    const removeItem = (itemId: string) => {
        updateBill({...bill, items: bill.items.filter(i => i.id !== itemId)});
    }

    const removeExtra = (extraId: string) => {
        updateBill({...bill, extras: bill.extras.filter(e => e.id !== extraId)});
    }
    
    const formatCurrency = (amount: number) => {
        return new Intl.NumberFormat('id-ID', { style: 'currency', currency: bill.currency, minimumFractionDigits: 0 }).format(amount);
    }

    return (
        <div className="space-y-6">
            <h2 className="text-3xl font-bold text-center text-green-600">{bill.title}</h2>
            
            {/* Items Section */}
            <div className="bg-white rounded-xl p-6 shadow-md">
                <h3 className="text-xl font-semibold mb-4 text-gray-800">Items</h3>
                <div className="space-y-2 mb-4">
                    {bill.items.map(item => (
                        <div key={item.id} className="bg-gray-50 p-3 rounded-lg border border-gray-200">
                            <div className="flex justify-between items-center">
                                <div>
                                    <p className="font-semibold">{item.name} ({item.quantity}x)</p>
                                    <p className="text-sm text-gray-500">{formatCurrency(item.price * item.quantity)}</p>
                                </div>
                                <button onClick={() => removeItem(item.id)} className="text-red-500 hover:text-red-600"><i className="fas fa-trash"></i></button>
                            </div>
                            <div className="flex flex-wrap gap-2 mt-3">
                                {bill.participants.map(p => (
                                    <button
                                        key={p.id}
                                        onClick={() => toggleItemParticipant(item.id, p.id)}
                                        className={`px-3 py-1 text-sm rounded-full border transition-all duration-200 ${
                                            item.participantIds.includes(p.id)
                                                ? 'text-white border-transparent'
                                                : 'text-gray-600 border-gray-300 hover:bg-gray-200'
                                        }`}
                                        style={{ backgroundColor: item.participantIds.includes(p.id) ? p.avatarColor : undefined }}
                                    >
                                        {p.name}
                                    </button>
                                ))}
                            </div>
                        </div>
                    ))}
                    {bill.items.length === 0 && <p className="text-gray-500 text-center py-4">No items yet. Add one below!</p>}
                </div>
                <div className="flex gap-2 justify-center">
                    <button onClick={() => setActiveModal('item')} className="flex-1 bg-green-500 hover:bg-green-600 text-white font-bold py-2 px-4 rounded-lg transition-colors"><i className="fas fa-plus mr-2"></i>Add Manually</button>
                    <button onClick={() => setActiveModal('ocr')} className="flex-1 bg-green-500 hover:bg-green-600 text-white font-bold py-2 px-4 rounded-lg transition-colors"><i className="fas fa-camera mr-2"></i>Scan Receipt</button>
                </div>
            </div>

            {/* Extras Section */}
             <div className="bg-white rounded-xl p-6 shadow-md">
                <h3 className="text-xl font-semibold mb-4 text-gray-800">Extras (Tax, Service, etc.)</h3>
                 <div className="space-y-2 mb-4">
                     {bill.extras.map(extra => (
                         <div key={extra.id} className="flex justify-between items-center bg-gray-50 p-3 rounded-lg border border-gray-200">
                             <div>
                                <p className="font-semibold">{extra.type} - <span className="text-gray-700">{extra.mode === ExtraMode.Percentage ? `${extra.value}%` : formatCurrency(extra.value)}</span></p>
                                <p className="text-sm text-gray-500">Split: {extra.splitMode}</p>
                             </div>
                              <button onClick={() => removeExtra(extra.id)} className="text-red-500 hover:text-red-600"><i className="fas fa-trash"></i></button>
                         </div>
                     ))}
                     {bill.extras.length === 0 && <p className="text-gray-500 text-center py-4">No extras added.</p>}
                 </div>
                <button onClick={() => setActiveModal('extra')} className="w-full bg-green-500 hover:bg-green-600 text-white font-bold py-2 px-4 rounded-lg transition-colors"><i className="fas fa-plus mr-2"></i>Add Extra</button>
             </div>

            {/* Summary Section */}
            {billCalculation && <SummaryView bill={bill} calculation={billCalculation} formatCurrency={formatCurrency} />}
            
            {/* Modals */}
            {activeModal === 'item' && <ManualItemForm onAddItem={addItem} onCancel={() => setActiveModal(null)} />}
            {activeModal === 'extra' && <ExtrasForm onAddExtra={addExtra} onCancel={() => setActiveModal(null)} bill={bill} />}
            {activeModal === 'ocr' && <OcrScanner onScanComplete={addItemsFromOcr} onCancel={() => setActiveModal(null)} />}
        </div>
    );
};

export default BillDetails;