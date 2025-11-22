
import { Bill, BillCalculation, Extra, ExtraMode, ExtraSplitMode, ExtraType } from '../types';

export const calculateBill = (bill: Bill): BillCalculation => {
    const participantTotals: BillCalculation['participantTotals'] = {};
    bill.participants.forEach(p => {
        participantTotals[p.id] = { subtotal: 0, extras: 0, total: 0, items: [] };
    });

    // 1. Calculate item shares and subtotals per person
    bill.items.forEach(item => {
        const totalItemPrice = item.price * item.quantity;
        if (item.participantIds.length > 0) {
            const share = totalItemPrice / item.participantIds.length;
            item.participantIds.forEach(pid => {
                participantTotals[pid].subtotal += share;
                participantTotals[pid].items.push({ name: item.name, share: share });
            });
        }
    });

    const billSubtotal = Object.values(participantTotals).reduce((sum, p) => sum + p.subtotal, 0);

    // 2. Calculate extras
    let extrasTotal = 0;
    const extrasApplied: { [key in ExtraType]?: number } = {};

    bill.extras.forEach(extra => {
        let extraAmount = 0;
        if (extra.mode === ExtraMode.Percentage) {
            extraAmount = billSubtotal * (extra.value / 100);
        } else {
            extraAmount = extra.value;
        }

        if (extra.type === ExtraType.Discount) {
            extraAmount = -extraAmount;
        }
        
        extrasTotal += extraAmount;
        extrasApplied[extra.type] = (extrasApplied[extra.type] || 0) + extraAmount;

        // 3. Distribute extras
        if (extra.splitMode === ExtraSplitMode.Equally) {
            const share = extraAmount / bill.participants.length;
            bill.participants.forEach(p => {
                participantTotals[p.id].extras += share;
            });
        } else if (extra.splitMode === ExtraSplitMode.Proportionally && billSubtotal > 0) {
            bill.participants.forEach(p => {
                const proportion = participantTotals[p.id].subtotal / billSubtotal;
                participantTotals[p.id].extras += extraAmount * proportion;
            });
        } else if (extra.splitMode === ExtraSplitMode.Host) {
            participantTotals[bill.hostId].extras += extraAmount;
        }
    });

    // 4. Calculate final totals
    bill.participants.forEach(p => {
        const personTotal = participantTotals[p.id];
        personTotal.total = personTotal.subtotal + personTotal.extras;
    });

    const grandTotal = billSubtotal + extrasTotal;

    return {
        subtotal: billSubtotal,
        extrasTotal,
        grandTotal,
        participantTotals,
    };
};
