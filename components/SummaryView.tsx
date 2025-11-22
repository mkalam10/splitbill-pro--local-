import React, { useState } from 'react';
import { Bill, BillCalculation } from '../types';

interface SummaryViewProps {
    bill: Bill;
    calculation: BillCalculation;
    formatCurrency: (amount: number) => string;
}

const SummaryView: React.FC<SummaryViewProps> = ({ bill, calculation, formatCurrency }) => {
    const [expandedParticipant, setExpandedParticipant] = useState<string | null>(null);

    const toggleParticipant = (id: string) => {
        setExpandedParticipant(expandedParticipant === id ? null : id);
    };

    return (
        <div className="bg-white rounded-xl p-6 shadow-md">
            <h3 className="text-xl font-semibold mb-4 text-center text-gray-800">Bill Summary</h3>
            
            <div className="bg-green-50 rounded-lg p-4 mb-4 text-center border border-green-200">
                <p className="text-gray-600">Total Bill Amount</p>
                <p className="text-4xl font-bold text-green-600">{formatCurrency(calculation.grandTotal)}</p>
                <p className="text-sm text-gray-500">
                    Subtotal: {formatCurrency(calculation.subtotal)} | Extras: {formatCurrency(calculation.extrasTotal)}
                </p>
            </div>

            <div className="space-y-3">
                {bill.participants.map(participant => {
                    const details = calculation.participantTotals[participant.id];
                    const isExpanded = expandedParticipant === participant.id;
                    return (
                        <div key={participant.id} className="bg-gray-50 rounded-lg overflow-hidden border border-gray-200">
                            <button 
                                onClick={() => toggleParticipant(participant.id)} 
                                className="w-full flex items-center justify-between p-4 text-left"
                            >
                                <div className="flex items-center space-x-3">
                                    <div className="w-8 h-8 rounded-full flex items-center justify-center text-white font-bold text-sm" style={{ backgroundColor: participant.avatarColor }}>
                                        {participant.name.charAt(0).toUpperCase()}
                                    </div>
                                    <span className="font-semibold">{participant.name}</span>
                                </div>
                                <div className="flex items-center space-x-4">
                                    <span className="text-lg font-bold text-green-600">{formatCurrency(details.total)}</span>
                                    <i className={`fas fa-chevron-down transition-transform duration-300 ${isExpanded ? 'rotate-180' : ''}`}></i>
                                </div>
                            </button>
                            {isExpanded && (
                                <div className="px-4 pb-4 bg-gray-50/50 animate-fade-in-down">
                                    <div className="border-t border-gray-200 pt-3">
                                        <div className="flow-root">
                                            <dl className="-my-2 text-sm divide-y divide-gray-200">
                                                <div className="flex items-center justify-between py-2">
                                                    <dt className="text-gray-500">Subtotal</dt>
                                                    <dd className="font-medium text-gray-800">{formatCurrency(details.subtotal)}</dd>
                                                </div>
                                                <div className="flex items-center justify-between py-2">
                                                    <dt className="text-gray-500">Extras Share</dt>
                                                    <dd className="font-medium text-gray-800">{formatCurrency(details.extras)}</dd>
                                                </div>
                                                <div className="flex items-center justify-between py-2 text-base">
                                                    <dt className="font-bold text-gray-900">Total Due</dt>
                                                    <dd className="font-bold text-green-600">{formatCurrency(details.total)}</dd>
                                                </div>
                                            </dl>
                                        </div>
                                         {details.items.length > 0 && <h4 className="font-semibold mt-4 mb-2 text-gray-700">Items:</h4>}
                                        <ul className="space-y-1 text-sm">
                                            {details.items.map((item, index) => (
                                                <li key={index} className="flex justify-between text-gray-500">
                                                    <span>- {item.name}</span>
                                                    <span>{formatCurrency(item.share)}</span>
                                                </li>
                                            ))}
                                        </ul>
                                    </div>
                                </div>
                            )}
                        </div>
                    );
                })}
            </div>
        </div>
    );
};

export default SummaryView;