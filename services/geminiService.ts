
import { GoogleGenAI, Type } from "@google/genai";
import { Item } from '../types';

const MODEL_NAME = 'gemini-2.5-flash';

export const extractItemsFromReceipt = async (base64Image: string, mimeType: string): Promise<Omit<Item, 'id' | 'participantIds'>[]> => {
    if (!process.env.API_KEY) {
        throw new Error("API_KEY environment variable not set");
    }
    
    try {
        const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

        const imagePart = {
            inlineData: {
                data: base64Image,
                mimeType: mimeType,
            },
        };

        const textPart = {
            text: `Analyze this receipt image. Extract all distinct line items. For each item, provide its name, quantity, and total price for that line.
            Ignore headers, footers, taxes, service charges, discounts, totals, or any line that is not a purchased product.
            Ensure the price is a number. Quantity should be a whole number. If quantity is not explicitly mentioned, assume it is 1.`,
        };

        const response = await ai.models.generateContent({
            model: MODEL_NAME,
            contents: { parts: [imagePart, textPart] },
            config: {
                responseMimeType: "application/json",
                responseSchema: {
                    type: Type.ARRAY,
                    items: {
                        type: Type.OBJECT,
                        properties: {
                            name: {
                                type: Type.STRING,
                                description: 'The name of the purchased item.',
                            },
                            quantity: {
                                type: Type.INTEGER,
                                description: 'The quantity of the item purchased.',
                            },
                            price: {
                                type: Type.NUMBER,
                                description: 'The total price for this line item (quantity * unit price).',
                            },
                        },
                         required: ["name", "quantity", "price"]
                    },
                },
            },
        });
        
        const jsonText = response.text.trim();
        const parsedItems = JSON.parse(jsonText);

        // Convert total price to price per item
        return parsedItems.map((item: any) => ({
            name: item.name,
            quantity: item.quantity,
            price: item.price / item.quantity,
        }));

    } catch (error) {
        console.error("Error processing receipt with Gemini:", error);
        throw new Error("Failed to extract items from the receipt. The image might be unclear or not a valid receipt.");
    }
};
