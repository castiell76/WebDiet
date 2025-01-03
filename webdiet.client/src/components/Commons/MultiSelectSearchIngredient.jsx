import React, { useState, useEffect } from 'react';
import { Search } from 'lucide-react';

const MultiSelectSearchIngredient = ({ onSelectionChange }) => {
    const [ingredients, setIngredients] = useState([]);
    const [selectedIngredients, setSelectedIngredients] = useState([]);
    const [searchQuery, setSearchQuery] = useState('');
    const [error, setError] = useState(null);

    const handleIngredientsChoose = async () => {
        try {
            const response = await fetch('/api/ingredient');
            if (!response.ok) {
                throw new Error('Failed to fetch ingredients');
            }
            const data = await response.json();
            setIngredients(data);
        } catch (error) {
            setError('Failed to load available ingredients');
        }
    };

    useEffect(() => {
        handleIngredientsChoose();
    }, []);

    useEffect(() => {
        const selectedIds = selectedIngredients.map(ingredient => ingredient.id);
        onSelectionChange?.(selectedIds);
    }, [selectedIngredients, onSelectionChange]);

    const filteredIngredients = ingredients.filter(ingredient =>
        ingredient.name.toLowerCase().includes(searchQuery.toLowerCase())
    );

    const toggleIngredient = (ingredient) => {
        setSelectedIngredients(prev =>
            prev.includes(ingredient)
                ? prev.filter(i => i !== ingredient)
                : [...prev, ingredient]
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
                        placeholder="Search ingredients..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                    />
                </div>

                {selectedIngredients.length > 0 && (
                    <div className="flex flex-wrap gap-1 mt-2">
                        {selectedIngredients.map(ingredient => (
                            <span
                                key={ingredient.id}
                                className="bg-blue-100 text-blue-800 px-2 py-1 rounded-md text-sm flex items-center gap-1"
                            >
                                {ingredient.name}
                                <button
                                    onClick={() => toggleIngredient(ingredient)}
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
                    ) : filteredIngredients.length === 0 ? (
                        <div className="p-2 text-gray-500">No ingredients found</div>
                    ) : (
                        filteredIngredients.map(ingredient => (
                            <div
                                key={ingredient.id}
                                className={`p-2 cursor-pointer hover:bg-gray-100 flex items-center gap-2 ${selectedIngredients.includes(ingredient) ? 'bg-blue-50' : ''
                                    }`}
                                onClick={() => toggleIngredient(ingredient)}
                            >
                                <input
                                    type="checkbox"
                                    checked={selectedIngredients.includes(ingredient)}
                                    onChange={() => { }}
                                    className="rounded text-blue-600"
                                />
                                <span>{ingredient.name}</span>
                            </div>
                        ))
                    )}
                </div>
            )}
        </div>
    );
};

export default MultiSelectSearchIngredient;