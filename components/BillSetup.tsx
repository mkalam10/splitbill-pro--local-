import React, { useState } from 'react';
import { Participant } from '../types';

interface BillSetupProps {
    onCreateBill: (title: string, participants: Participant[]) => void;
    onShowHistory: () => void;
    hasHistory: boolean;
}

const colors = [
    '#f94144', '#f3722c', '#f8961e', '#f9c74f', '#90be6d', '#43aa8b', '#577590',
    '#ef476f', '#ffd166', '#06d6a0', '#118ab2', '#073b4c',
];

const BillSetup: React.FC<BillSetupProps> = ({ onCreateBill, onShowHistory, hasHistory }) => {
    const [title, setTitle] = useState('');
    const [participants, setParticipants] = useState<Participant[]>([]);
    const [newParticipantName, setNewParticipantName] = useState('');

    const addParticipant = (e: React.FormEvent) => {
        e.preventDefault();
        if (newParticipantName.trim()) {
            const newParticipant: Participant = {
                id: Date.now().toString(),
                name: newParticipantName.trim(),
                avatarColor: colors[participants.length % colors.length],
            };
            setParticipants([...participants, newParticipant]);
            setNewParticipantName('');
        }
    };

    const removeParticipant = (id: string) => {
        setParticipants(participants.filter(p => p.id !== id));
    };

    const handleCreateBill = () => {
        if (title.trim() && participants.length > 1) {
            onCreateBill(title.trim(), participants);
        }
    };

    return (
        <div className="bg-white rounded-xl p-6 shadow-lg animate-fade-in">
            <h2 className="text-2xl font-bold text-green-600 mb-6">Create a New Bill</h2>
            
            <div className="space-y-6">
                <div>
                    <label htmlFor="billTitle" className="block text-sm font-medium text-gray-600 mb-1">Bill Title</label>
                    <input
                        id="billTitle"
                        type="text"
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                        placeholder="e.g., Dinner at Sushi Place"
                        className="w-full bg-gray-50 border border-gray-300 rounded-lg px-4 py-2 text-gray-800 focus:outline-none focus:ring-2 focus:ring-green-500"
                    />
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-600 mb-1">Participants</label>
                    <form onSubmit={addParticipant} className="flex space-x-2">
                        <input
                            type="text"
                            value={newParticipantName}
                            onChange={(e) => setNewParticipantName(e.target.value)}
                            placeholder="Add participant name..."
                            className="flex-grow bg-gray-50 border border-gray-300 rounded-lg px-4 py-2 text-gray-800 focus:outline-none focus:ring-2 focus:ring-green-500"
                        />
                        <button type="submit" className="bg-green-500 hover:bg-green-600 text-white font-bold py-2 px-4 rounded-lg transition-colors duration-200">
                            Add
                        </button>
                    </form>
                </div>

                <div className="space-y-2">
                    {participants.map(p => (
                        <div key={p.id} className="flex items-center justify-between bg-gray-100 p-2 rounded-lg">
                            <div className="flex items-center space-x-3">
                                <div className="w-8 h-8 rounded-full flex items-center justify-center text-white font-bold" style={{ backgroundColor: p.avatarColor }}>
                                    {p.name.charAt(0).toUpperCase()}
                                </div>
                                <span className="text-gray-800">{p.name}</span>
                            </div>
                            <button onClick={() => removeParticipant(p.id)} className="text-red-500 hover:text-red-600">
                                <i className="fa-solid fa-trash-can"></i>
                            </button>
                        </div>
                    ))}
                     {participants.length < 2 && <p className="text-sm text-yellow-600 p-2">Add at least 2 participants to start.</p>}
                </div>

                <button
                    onClick={handleCreateBill}
                    disabled={!title.trim() || participants.length < 2}
                    className="w-full bg-green-500 hover:bg-green-600 text-white font-bold py-3 px-4 rounded-lg transition-colors duration-200 disabled:bg-gray-300 disabled:cursor-not-allowed flex items-center justify-center space-x-2"
                >
                    <i className="fa-solid fa-arrow-right"></i>
                    <span>Start Splitting</span>
                </button>
                {hasHistory && (
                     <button
                        onClick={onShowHistory}
                        className="w-full mt-2 bg-white hover:bg-gray-100 text-gray-700 font-bold py-3 px-4 rounded-lg transition-colors duration-200 flex items-center justify-center space-x-2 border border-gray-300"
                    >
                        <i className="fa-solid fa-calendar-days"></i>
                        <span>View History</span>
                    </button>
                )}
            </div>
        </div>
    );
};

export default BillSetup;