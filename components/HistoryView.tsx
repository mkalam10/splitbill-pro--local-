import React, { useState, useMemo } from 'react';
import { Bill } from '../types';
import { calculateBill } from '../services/calculationService';


interface HistoryViewProps {
    bills: Bill[];
    onLoadBill: (billId: string) => void;
    onBack: () => void;
}

const HistoryView: React.FC<HistoryViewProps> = ({ bills, onLoadBill, onBack }) => {
    const [currentDate, setCurrentDate] = useState(new Date());
    const [selectedDate, setSelectedDate] = useState<Date | null>(null);

    const billsByDate = useMemo(() => {
        const map = new Map<string, Bill[]>();
        bills.forEach(bill => {
            const dateKey = new Date(bill.date).toISOString().split('T')[0];
            if (!map.has(dateKey)) {
                map.set(dateKey, []);
            }
            map.get(dateKey)!.push(bill);
        });
        return map;
    }, [bills]);

    const calendarGrid = useMemo(() => {
        const year = currentDate.getFullYear();
        const month = currentDate.getMonth();

        const firstDayOfMonth = new Date(year, month, 1);
        const lastDayOfMonth = new Date(year, month + 1, 0);

        const days = [];
        // Add days from previous month
        const startDay = firstDayOfMonth.getDay();
        for (let i = startDay; i > 0; i--) {
            const prevDate = new Date(firstDayOfMonth);
            prevDate.setDate(prevDate.getDate() - i);
            days.push({ date: prevDate, isCurrentMonth: false });
        }

        // Add days of current month
        for (let i = 1; i <= lastDayOfMonth.getDate(); i++) {
            days.push({ date: new Date(year, month, i), isCurrentMonth: true });
        }

        // Add days from next month
        const endDay = lastDayOfMonth.getDay();
        for (let i = 1; i < 7 - endDay; i++) {
            const nextDate = new Date(lastDayOfMonth);
            nextDate.setDate(nextDate.getDate() + i);
            days.push({ date: nextDate, isCurrentMonth: false });
        }
        return days;
    }, [currentDate]);

    const handlePrevMonth = () => {
        setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1));
        setSelectedDate(null);
    };

    const handleNextMonth = () => {
        setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1));
        setSelectedDate(null);
    };
    
    const handleDateClick = (date: Date) => {
        const dateKey = date.toISOString().split('T')[0];
        if (billsByDate.has(dateKey)) {
             setSelectedDate(selectedDate?.getTime() === date.getTime() ? null : date);
        }
    }
    
    const formatCurrency = (amount: number, currency: string) => {
        return new Intl.NumberFormat('id-ID', { style: 'currency', currency, minimumFractionDigits: 0 }).format(amount);
    }
    
    const selectedBills = selectedDate ? billsByDate.get(selectedDate.toISOString().split('T')[0]) || [] : [];

    return (
        <div className="bg-white rounded-xl p-6 shadow-lg animate-fade-in space-y-6">
            <div className="flex justify-between items-center">
                 <button onClick={onBack} className="bg-gray-100 hover:bg-gray-200 text-gray-800 font-bold py-2 px-4 rounded-lg transition-colors duration-200 flex items-center space-x-2 border border-gray-300">
                    <i className="fa-solid fa-arrow-left"></i>
                    <span>Back</span>
                </button>
                <h2 className="text-2xl font-bold text-green-600">Bill History</h2>
                <div className="w-24"></div>
            </div>

            {/* Calendar */}
            <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
                <div className="flex justify-between items-center mb-4">
                    <button onClick={handlePrevMonth} className="p-2 rounded-full hover:bg-gray-200"><i className="fas fa-chevron-left"></i></button>
                    <h3 className="text-lg font-semibold">{new Intl.DateTimeFormat('en-US', { month: 'long', year: 'numeric' }).format(currentDate)}</h3>
                    <button onClick={handleNextMonth} className="p-2 rounded-full hover:bg-gray-200"><i className="fas fa-chevron-right"></i></button>
                </div>
                <div className="grid grid-cols-7 gap-1 text-center text-sm">
                    {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => <div key={day} className="font-bold text-gray-500">{day}</div>)}
                    {calendarGrid.map(({ date, isCurrentMonth }, index) => {
                        const dateKey = date.toISOString().split('T')[0];
                        const hasBills = billsByDate.has(dateKey);
                        return (
                            <div key={index} className="relative">
                                <button
                                    onClick={() => handleDateClick(date)}
                                    disabled={!hasBills}
                                    className={`w-10 h-10 flex items-center justify-center rounded-full transition-colors duration-200
                                    ${isCurrentMonth ? 'text-gray-800' : 'text-gray-400'}
                                    ${selectedDate?.getTime() === date.getTime() ? 'bg-green-500 text-white' : hasBills ? 'hover:bg-gray-200 cursor-pointer' : 'cursor-default'}
                                `}>
                                    {date.getDate()}
                                </button>
                                {hasBills && <div className="absolute bottom-1 left-1/2 -translate-x-1/2 w-1.5 h-1.5 bg-green-500 rounded-full"></div>}
                             </div>
                        )
                    })}
                </div>
            </div>
            
            {/* Selected Bills */}
            {selectedDate && (
                <div className="animate-fade-in-up">
                    <h3 className="text-lg font-semibold mb-2 text-gray-700">Bills for {new Intl.DateTimeFormat('en-US', { dateStyle: 'long'}).format(selectedDate)}</h3>
                    <div className="space-y-2 max-h-60 overflow-y-auto pr-2">
                        {selectedBills.length > 0 ? selectedBills.map(bill => {
                             const calculation = calculateBill(bill);
                             return (
                                <button key={bill.id} onClick={() => onLoadBill(bill.id)} className="w-full text-left bg-gray-100 hover:bg-gray-200 p-3 rounded-lg transition-colors duration-200 flex justify-between items-center border border-gray-200">
                                    <span className="font-semibold">{bill.title}</span>
                                    <span className="font-bold text-green-600">{formatCurrency(calculation.grandTotal, bill.currency)}</span>
                                </button>
                             )
                        }) : <p>No bills found for this date.</p>}
                    </div>
                </div>
            )}
        </div>
    );
};

export default HistoryView;