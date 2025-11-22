
import React, { useState, useMemo, useCallback, useEffect } from 'react';
import { Bill, Participant, User } from './types';
import BillSetup from './components/BillSetup';
import BillDetails from './components/BillDetails';
import HistoryView from './components/HistoryView';
import Auth from './components/Auth';
import { calculateBill } from './services/calculationService';
import { getBills, saveBill } from './services/historyService';
import * as authService from './services/authService';


const App: React.FC = () => {
    const [currentUser, setCurrentUser] = useState<User | null>(null);
    const [bill, setBill] = useState<Bill | null>(null);
    const [historicalBills, setHistoricalBills] = useState<Bill[]>([]);
    const [view, setView] = useState<'bill' | 'history'>('bill');
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const user = authService.getCurrentUser();
        if (user) {
            setCurrentUser(user);
        }
        setIsLoading(false);
    }, []);

    useEffect(() => {
        const fetchBills = async () => {
            if (currentUser) {
                setIsLoading(true);
                const loadedBills = await getBills();
                setHistoricalBills(loadedBills);
                setIsLoading(false);
            } else {
                setHistoricalBills([]);
            }
        };

        fetchBills();
    }, [currentUser]);

    const handleLoginSuccess = (user: User) => {
        setCurrentUser(user);
    };

    const handleLogout = () => {
        authService.logout();
        setCurrentUser(null);
        setBill(null);
        setView('bill');
    };

    const handleCreateBill = (title: string, participants: Participant[]) => {
        const newBill: Bill = {
            id: `temp_${Date.now()}`, // Temporary ID for new bills
            title,
            date: new Date().toISOString(),
            hostId: participants[0].id,
            participants,
            items: [],
            extras: [],
            currency: 'IDR'
        };
        setBill(newBill);
        setView('bill');
    };

    const handleSaveAndReset = async () => {
        if (bill && bill.items.length > 0 && currentUser) {
            try {
                const savedBill = await saveBill(bill);
                // Optimistically update history
                const existingIndex = historicalBills.findIndex(b => b.id === savedBill.id || b.id === bill.id);
                if (existingIndex > -1) {
                    const updatedHistory = [...historicalBills];
                    updatedHistory[existingIndex] = savedBill;
                    setHistoricalBills(updatedHistory);
                } else {
                    setHistoricalBills([savedBill, ...historicalBills]);
                }
            } catch (error) {
                console.error("Failed to save bill:", error);
                alert("Could not save the bill. Please try again.");
            }
        }
        setBill(null);
        setView('bill');
    };
    
    const handleLoadBill = (billId: string) => {
        const billToLoad = historicalBills.find(b => b.id === billId);
        if (billToLoad) {
            setBill(billToLoad);
            setView('bill');
        }
    };

    const handleViewHistory = () => {
        setView('history');
    }

    const handleBackToBill = () => {
        setView('bill');
    }


    const updateBill = useCallback((updatedBill: Bill) => {
        setBill(updatedBill);
    }, []);

    const billCalculation = useMemo(() => {
        if (!bill) return null;
        return calculateBill(bill);
    }, [bill]);

    if (isLoading && !currentUser) {
         return <div className="min-h-screen flex items-center justify-center"><div className="animate-spin rounded-full h-16 w-16 border-b-2 border-green-500"></div></div>;
    }

    if (!currentUser) {
        return <Auth onLoginSuccess={handleLoginSuccess} />;
    }

    return (
        <div className="min-h-screen bg-gray-100 text-gray-800 font-sans p-4 sm:p-6 lg:p-8">
            <div className="max-w-4xl mx-auto">
                <header className="flex justify-between items-center mb-6">
                    <div className="flex items-center space-x-3">
                        <i className="fa-solid fa-receipt text-3xl text-green-500"></i>
                        <h1 className="text-3xl font-bold text-gray-900">SplitBill Pro</h1>
                    </div>
                    <div className="flex items-center space-x-2">
                        <span className="text-gray-600 hidden sm:inline">Welcome, {currentUser.name}!</span>
                         {historicalBills.length > 0 && view === 'bill' && !bill && (
                            <button
                                onClick={handleViewHistory}
                                className="bg-white hover:bg-gray-200 text-gray-700 font-bold py-2 px-4 rounded-lg transition-colors duration-200 flex items-center space-x-2 border border-gray-300"
                                title="View History"
                            >
                                <i className="fa-solid fa-calendar-days"></i>
                                <span className="hidden sm:inline">History</span>
                            </button>
                        )}
                        {bill && (
                            <button
                                onClick={handleSaveAndReset}
                                className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded-lg transition-colors duration-200 flex items-center space-x-2"
                                title="Save and start new bill"
                            >
                                <i className="fa-solid fa-plus"></i>
                                <span className="hidden sm:inline">New Bill</span>
                            </button>
                        )}
                        <button
                            onClick={handleLogout}
                            className="bg-red-500 hover:bg-red-600 text-white font-bold py-2 px-4 rounded-lg transition-colors duration-200 flex items-center space-x-2"
                            title="Logout"
                        >
                            <i className="fa-solid fa-power-off"></i>
                            <span className="hidden sm:inline">Logout</span>
                        </button>
                    </div>
                </header>
                <main>
                    {view === 'history' ? (
                        <HistoryView bills={historicalBills} onLoadBill={handleLoadBill} onBack={handleBackToBill} />
                    ) : !bill ? (
                        <BillSetup 
                            onCreateBill={handleCreateBill} 
                            onShowHistory={handleViewHistory}
                            hasHistory={historicalBills.length > 0}
                        />
                    ) : (
                        <BillDetails 
                            bill={bill} 
                            updateBill={updateBill} 
                            billCalculation={billCalculation}
                        />
                    )}
                </main>
                 <footer className="text-center mt-12 text-gray-500 text-sm">
                    <p>Powered by Gemini API. Built with React & TypeScript.</p>
                </footer>
            </div>
        </div>
    );
};

export default App;
