import React, { useState, useRef, useCallback } from 'react';
import { Item } from '../types';
import { extractItemsFromReceipt } from '../services/geminiService';

interface OcrScannerProps {
    onScanComplete: (items: Omit<Item, 'id' | 'participantIds'>[]) => void;
    onCancel: () => void;
}

const fileToBase64 = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = () => resolve((reader.result as string).split(',')[1]);
        reader.onerror = error => reject(error);
    });
};

const OcrScanner: React.FC<OcrScannerProps> = ({ onScanComplete, onCancel }) => {
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [preview, setPreview] = useState<string | null>(null);
    const [scannedItems, setScannedItems] = useState<Omit<Item, 'id' | 'participantIds'>[] | null>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);

    const handleFileChange = useCallback(async (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (!file) return;

        setIsLoading(true);
        setError(null);
        setScannedItems(null);

        const previewUrl = URL.createObjectURL(file);
        setPreview(previewUrl);

        try {
            const base64Image = await fileToBase64(file);
            const items = await extractItemsFromReceipt(base64Image, file.type);
            setScannedItems(items);
        } catch (e: any) {
            setError(e.message || "An unknown error occurred.");
        } finally {
            setIsLoading(false);
        }
    }, []);
    
    const triggerFileSelect = () => fileInputRef.current?.click();

    return (
        <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-xl p-6 shadow-2xl w-full max-w-lg animate-fade-in-up">
                <div className="flex justify-between items-center mb-4">
                    <h3 className="text-xl font-bold text-green-600">Scan Receipt</h3>
                    <button onClick={onCancel} className="text-gray-400 hover:text-gray-600 text-2xl">&times;</button>
                </div>
                
                <div className="space-y-4">
                    {!scannedItems ? (
                        <>
                            <input type="file" accept="image/*" ref={fileInputRef} onChange={handleFileChange} className="hidden" />
                            <button onClick={triggerFileSelect} disabled={isLoading} className="w-full bg-green-500 hover:bg-green-600 text-white font-bold py-3 px-4 rounded-lg flex items-center justify-center space-x-2 transition-colors disabled:bg-gray-300">
                                <i className="fas fa-camera"></i>
                                <span>{preview ? 'Choose a Different Photo' : 'Take or Upload Photo'}</span>
                            </button>
                            {preview && <img src={preview} alt="Receipt preview" className="mt-4 rounded-lg max-h-60 w-auto mx-auto"/>}
                        </>
                    ) : (
                         <div className="space-y-2 max-h-64 overflow-y-auto pr-2">
                             <p className="text-sm text-gray-600 mb-2">Review the scanned items before adding:</p>
                             {scannedItems.map((item, index) => (
                                 <div key={index} className="bg-gray-100 p-2 rounded-md flex justify-between items-center">
                                     <span>{item.name} ({item.quantity}x)</span>
                                     <span>{new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR' }).format(item.price * item.quantity)}</span>
                                 </div>
                             ))}
                         </div>
                    )}
                    
                    {isLoading && (
                        <div className="text-center p-4">
                            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-500 mx-auto"></div>
                            <p className="mt-2 text-gray-600">Scanning receipt with Gemini...</p>
                        </div>
                    )}

                    {error && <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-lg text-center">{error}</div>}
                    
                    {scannedItems && (
                        <div className="flex gap-2 mt-4">
                           <button onClick={onCancel} className="flex-1 bg-gray-200 hover:bg-gray-300 text-gray-800 font-bold py-2 px-4 rounded-lg transition-colors">Cancel</button>
                           <button onClick={() => onScanComplete(scannedItems)} className="flex-1 bg-green-500 hover:bg-green-600 text-white font-bold py-2 px-4 rounded-lg transition-colors">Add Items to Bill</button>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default OcrScanner;