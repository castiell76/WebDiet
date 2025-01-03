import React, { useState, useEffect } from 'react';
import { Search } from 'lucide-react';

const MultiSelectSearchAllergen = ({ onSelectionChange }) => {
    const [allergens, setAllergens] = useState([]);
    const [selectedAllergens, setSelectedAllergens] = useState([]);
    const [searchQuery, setSearchQuery] = useState('');
    const [error, setError] = useState(null);

    const handleAllergenChoose = async () => {
        try {
            const response = await fetch('/api/ingredients/allergen');
            if (!response.ok) {
                throw new Error('Failed to fetch allergens');
            }
            const data = await response.json();
            setAllergens(data);
        } catch (error) {
            setError('Failed to load available allergens');
        }
    };

    useEffect(() => {
        handleAllergenChoose();
    }, []);

    useEffect(() => {
        const selectedIds = selectedAllergens.map(allergen => allergen.id);
        onSelectionChange?.(selectedIds);
    }, [selectedAllergens]);

    const filteredAllergens = allergens.filter(allergen =>
        allergen.name.toLowerCase().includes(searchQuery.toLowerCase())
    );

    const toggleAllergen = (allergen) => {
        setSelectedAllergens(prev =>
            prev.includes(allergen)
                ? prev.filter(i => i !== allergen)
                : [...prev, allergen]
        );
    };

    return (
        <div className="relative w-full max-w-md">
            <div className="border rounded-lg p-2 bg-white">
                <div className="flex items-center gap-2">
                    <Search className="w-4 h-4 text-gray-500" />
                    <input
                        type="text"
                        className="w-full outline-none"
                        placeholder="Search allergens..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                    />
                </div>

                {selectedAllergens.length > 0 && (
                    <div className="flex flex-wrap gap-1 mt-2">
                        {selectedAllergens.map(allergen => (
                            <span
                                key={allergen.id}
                                className="bg-blue-100 text-blue-800 px-2 py-1 rounded-md text-sm flex items-center gap-1"
                            >
                                {allergen.name}
                                <button
                                    onClick={() => toggleAllergen(allergen)}
                                    className="ml-1 text-blue-600 hover:text-blue-800"
                                >
                                    ×
                                </button>
                            </span>
                        ))}
                    </div>
                )}
            </div>

            {searchQuery && (
                <div className="absolute w-full mt-1 bg-white border rounded-lg shadow-lg max-h-60 overflow-y-auto z-10">
                    {error ? (
                        <div className="p-2 text-red-500">{error}</div>
                    ) : filteredAllergens.length === 0 ? (
                        <div className="p-2 text-gray-500">No allergens found</div>
                    ) : (
                        filteredAllergens.map(allergen => (
                            <div
                                key={allergen.id}
                                className={`p-2 cursor-pointer hover:bg-gray-100 flex items-center gap-2 ${selectedAllergens.includes(allergen) ? 'bg-blue-50' : ''
                                    }`}
                                onClick={() => toggleAllergen(allergen)}
                            >
                                <input
                                    type="checkbox"
                                    checked={selectedAllergens.includes(allergen)}
                                    onChange={() => { }}
                                    className="rounded text-blue-600"
                                />
                                <span>{allergen.name}</span>
                            </div>
                        ))
                    )}
                </div>
            )}
        </div>
    );
};

export default MultiSelectSearchAllergen;