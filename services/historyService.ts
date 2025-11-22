
import { Bill } from '../types';
import { getCurrentUser } from './authService';

const BILLS_KEY = 'splitbill_bills';

interface StoredBill extends Bill {
    userId: string;
}

const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

export const getBills = async (): Promise<Bill[]> => {
    await delay(400);
    const currentUser = getCurrentUser();
    if (!currentUser) return [];

    try {
        const billsJSON = localStorage.getItem(BILLS_KEY);
        const allBills: StoredBill[] = billsJSON ? JSON.parse(billsJSON) : [];

        // Filter bills belonging to the current user
        return allBills
            .filter(bill => bill.userId === currentUser.id)
            .map(({ userId, ...bill }) => bill as Bill)
            .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
    } catch (error) {
        console.error("Failed to load local bills", error);
        return [];
    }
};

export const saveBill = async (bill: Bill): Promise<Bill> => {
    await delay(400);
    const currentUser = getCurrentUser();
    if (!currentUser) throw new Error("Not authenticated");

    try {
        const billsJSON = localStorage.getItem(BILLS_KEY);
        let allBills: StoredBill[] = billsJSON ? JSON.parse(billsJSON) : [];

        // Check if it's a new bill (has temp ID)
        const isNew = bill.id.startsWith('temp_');
        let savedBill: StoredBill;

        if (isNew) {
            // Create new bill entry
            savedBill = {
                ...bill,
                id: `bill_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
                userId: currentUser.id,
                date: new Date().toISOString()
            };
            allBills.push(savedBill);
        } else {
            // Update existing bill
            const index = allBills.findIndex(b => b.id === bill.id && b.userId === currentUser.id);
            
            if (index === -1) {
                // If ID exists but not found (unexpected), treat as new or handle gracefully
                savedBill = { ...bill, userId: currentUser.id };
                allBills.push(savedBill);
            } else {
                savedBill = { ...bill, userId: currentUser.id };
                allBills[index] = savedBill;
            }
        }

        localStorage.setItem(BILLS_KEY, JSON.stringify(allBills));

        // Return clean Bill object without internal storage fields
        const { userId, ...billToReturn } = savedBill;
        return billToReturn as Bill;
    } catch (error) {
        console.error("Failed to save bill locally", error);
        throw error;
    }
};
