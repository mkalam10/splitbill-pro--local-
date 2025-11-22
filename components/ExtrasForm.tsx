import React, { useState } from 'react';
import { Extra, ExtraType, ExtraMode, ExtraSplitMode, Bill } from '../types';

interface ExtrasFormProps {
    onAddExtra: (extra: Omit<Extra, 'id'>) => void;
    onCancel: () => void;
    bill: Bill;
}

const ExtrasForm: React.FC<ExtrasFormProps> = ({ onAddExtra, onCancel, bill }) => {
    const [type, setType] = useState<ExtraType>(ExtraType.Tax);
    const [mode, setMode] = useState<ExtraMode>(ExtraMode.Percentage);
    const [value, setValue] = useState(0);
    const [splitMode, setSplitMode] = useState<ExtraSplitMode>(ExtraSplitMode.Proportionally);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (value > 0) {
            onAddExtra({ type, mode, value, splitMode });
        }
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50 p-4">
            <form onSubmit={handleSubmit} className="bg-white rounded-xl p-6 shadow-2xl w-full max-w-sm animate-fade-in-up">
                <h3 className="text-xl font-bold text-green-600 mb-6">Add Extra Charge/Discount</h3>
                <div className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-600 mb-1">Type</label>
                        <select value={type} onChange={e => setType(e.target.value as ExtraType)} className="w-full bg-gray-50 border border-gray-300 rounded-lg px-3 py-2 text-gray-800 focus:outline-none focus:ring-2 focus:ring-green-500">
                            {Object.values(ExtraType).map(t => <option key={t} value={t}>{t}</option>)}
                        </select>
                    </div>
                    <div className="flex gap-2">
                        <div className="flex-1">
                            <label className="block text-sm font-medium text-gray-600 mb-1">Mode</label>
                            <select value={mode} onChange={e => setMode(e.target.value as ExtraMode)} className="w-full bg-gray-50 border border-gray-300 rounded-lg px-3 py-2 text-gray-800 focus:outline-none focus:ring-2 focus:ring-green-500">
                                <option value={ExtraMode.Percentage}>Percentage (%)</option>
                                <option value={ExtraMode.Fixed}>Fixed Amount</option>
                            </select>
                        </div>
                        <div className="flex-1">
                            <label className="block text-sm font-medium text-gray-600 mb-1">Value</label>
                            <input type="number" min="0" value={value} onChange={e => setValue(parseFloat(e.target.value))} className="w-full bg-gray-50 border border-gray-300 rounded-lg px-3 py-2 text-gray-800 focus:outline-none focus:ring-2 focus:ring-green-500" required />
                        </div>
                    </div>
                     <div>
                        <label className="block text-sm font-medium text-gray-600 mb-1">Split Mode</label>
                        <select value={splitMode} onChange={e => setSplitMode(e.target.value as ExtraSplitMode)} className="w-full bg-gray-50 border border-gray-300 rounded-lg px-3 py-2 text-gray-800 focus:outline-none focus:ring-2 focus:ring-green-500">
                            <option value={ExtraSplitMode.Proportionally}>Proportionally</option>
                            <option value={ExtraSplitMode.Equally}>Equally</option>
                            <option value={ExtraSplitMode.Host}>Host ({bill.participants.find(p => p.id === bill.hostId)?.name}) Pays</option>
                        </select>
                    </div>
                </div>
                 <div className="flex gap-2 mt-6">
                    <button type="button" onClick={onCancel} className="flex-1 bg-gray-200 hover:bg-gray-300 text-gray-800 font-bold py-2 px-4 rounded-lg transition-colors">Cancel</button>
                    <button type="submit" className="flex-1 bg-green-500 hover:bg-green-600 text-white font-bold py-2 px-4 rounded-lg transition-colors">Add Extra</button>
                </div>
            </form>
        </div>
    );
};

export default ExtrasForm;