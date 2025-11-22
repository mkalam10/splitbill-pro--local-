
export interface User {
    id: string;
    name: string;
    email: string;
}

export interface Participant {
    id: string;
    name: string;
    avatarColor: string;
}

export interface Item {
    id: string;
    name: string;
    quantity: number;
    price: number; // Price per item
    participantIds: string[];
}

export enum ExtraType {
    Tax = 'Tax',
    Service = 'Service',
    Delivery = 'Delivery',
    Discount = 'Discount',
}

export enum ExtraMode {
    Percentage = 'Percentage',
    Fixed = 'Fixed',
}

export enum ExtraSplitMode {
    Equally = 'Equally',
    Proportionally = 'Proportionally',
    Host = 'Host',
}

export interface Extra {
    id: string;
    type: ExtraType;
    mode: ExtraMode;
    value: number;
    splitMode: ExtraSplitMode;
}

export interface Bill {
    id: string; // Frontend uses this, it will be the same as _id from backend
    title: string;
    date: string;
    hostId: string;
    participants: Participant[];
    items: Item[];
    extras: Extra[];
    currency: string;
}

export interface BillCalculation {
    subtotal: number;
    extrasTotal: number;
    grandTotal: number;
    participantTotals: {
        [participantId: string]: {
            subtotal: number;
            extras: number;
            total: number;
            items: { name: string; share: number; }[];
        };
    };
}
