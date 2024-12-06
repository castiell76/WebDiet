import React, { useState, useEffect } from 'react';
import { Button, Card, Modal, Form, Dropdown, InputGroup } from 'react-bootstrap';

function MealCard({ mealType, description, imagePath, meals, onMealSelect }) {
    const [showModal, setShowModal] = useState(false);
    const [showModalDetail, setShowModalDetail] = useState(false);
    const [showIngredientModal, setShowIngredientModal] = useState(false);
    const [searchValue, setSearchValue] = useState('');
    const [selectedMeal, setSelectedMeal] = useState(null);
    const [customMeal, setCustomMeal] = useState(null);
    const [mealDetails, setMealDetails] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [editingIngredient, setEditingIngredient] = useState(null);
    const [availableIngredients, setAvailableIngredients] = useState([]);
    const [showEditModal, setShowEditModal] = useState(false);
    const [editedMeal, setEditedMeal] = useState(null);
    const [editedIngredients, setEditedIngredients] = useState([]);
    const [pendingReplacements, setPendingReplacements] = useState([]);

    const handleShow = () => setShowModal(true);
    const handleClose = () => setShowModal(false);
    const handleShowDetail = async () => {
        if (selectedMeal) {
            setShowModalDetail(true);
            await fetchMealDetails();
        }
    };
    const handleCloseDetail = () => {
        setShowModalDetail(false);
        setMealDetails(null);
        setError(null);
    };



    const handleMealSelect = (meal) => {
        console.log("wywoluje handlemealselect");
        setSelectedMeal(meal);
        onMealSelect(meal);
        setShowModal(false);
        setEditedIngredients(meal.ingredients || []);
        setShowEditModal(true);
    };

    const handleSaveCustomMeal = async () => {
        try {
            const response = await fetch('/api/usercustomdish', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    userId: 1,
                    baseDishId: selectedMeal.id,
                    name: editedMeal.name,
                    ingredients: editedMeal.ingredients,
                }),
            });

            if (!response.ok) throw new Error('Failed to save meal');

            const savedMeal = await response.json();
            setCustomMeal(savedMeal);
            onMealSelect(savedMeal); // przekazanie zapisanego dania do rodzica
            setShowEditModal(false);
        } catch (error) {
            console.error('Error saving meal:', error);
        }
    };
    const addMeal = async (meal) => {
        console.log("wywoluje add")
        try {
            // Create custom dish based on selected meal
            const response = await fetch('/api/usercustomdish', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    userId: 1,
                    baseDishId: meal.id,
                    name: meal.name
                })
            });

            if (!response.ok) throw new Error('Failed to create custom dish');

            const customDish = await response.json();
            setSelectedMeal(meal);
            setCustomMeal(customDish);
            onMealSelect(customDish);

        } catch (error) {
            console.error('Error creating custom dish:', error);
        }
        setShowModal(false);
    };

    const selectMeal = (meal) => {
        setSelectedMeal(meal); // Ustawienie wybranego dania
        setShowModal(false); // Zamkniêcie modala wyboru dania
        setShowEditModal(false); // Otwórz modal edycji sk³adników
    };


    const handleReplaceIngredient = (oldIngredientId) => {
        setEditingIngredient(oldIngredientId);
        setShowIngredientModal(true);
    };

    const handleIngredientReplacement = (newIngredientId) => {
        setPendingReplacements(prev => [...prev, {
            dishId: mealDetails.id,
            oldIngredientId: editingIngredient,
            newIngredientId: newIngredientId
        }]);

        setMealDetails(prevDetails => ({
            ...prevDetails,
            ingredients: prevDetails.ingredients.map(ing =>
                ing.id === editingIngredient
                    ? { ...ing, id: newIngredientId, name: ing.name }

                    : ing
            )
        }));
        

        setShowIngredientModal(false);
        setEditingIngredient(null);
    };

    const saveAllChanges = async () => {
        try {
            // Wyœlij wszystkie oczekuj¹ce zmiany
            const responses = await Promise.all(
                pendingReplacements.map(replacement =>
                    fetch(`/api/dishingredient/replace`, {
                        method: 'PUT',
                        headers: {
                            'Content-Type': 'application/json',
                        },
                        body: JSON.stringify(replacement)
                    })
                )
            );

            // SprawdŸ, czy wszystkie odpowiedzi s¹ OK
            if (responses.every(response => response.ok)) {
                // Wyczyœæ oczekuj¹ce zmiany
                setPendingReplacements([]);
                // Odœwie¿ dane
                await fetchMealDetails();
            } else {
                throw new Error('Some replacements failed');
            }
        } catch (error) {
            console.error('Error saving changes:', error);
            // Mo¿esz tutaj dodaæ obs³ugê b³êdów, np. wyœwietlenie komunikatu
        }
    };

    const handleQuantityChange = async (ingredientId, newQuantity) => {
        const updatedIngredients = mealDetails.ingredients.map(ing =>
            ing.id === ingredientId ? { ...ing, quantity: newQuantity } : ing
        );

        // Tworzenie nowego obiektu DishIngredient
        const dishIngredient = {
            dishId: mealDetails.id,
            ingredientId: ingredientId,
            quantity: newQuantity
        };

        try {
            const response = await fetch('/api/dishingredient', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(dishIngredient)
            });

            if (!response.ok) {
                throw new Error('Failed to update ingredient quantity');
            }

            setMealDetails({
                ...mealDetails,
                ingredients: updatedIngredients
            });
        } catch (error) {
            console.error('Error updating ingredient:', error);
        }
    };


    const handleRemoveIngredient = async (ingredientId) => {
        try {
            const response = await fetch(`/api/dishingredient/${mealDetails.id}/${ingredientId}`, {
                method: 'DELETE'
            });

            if (!response.ok) {
                throw new Error('Failed to remove ingredient');
            }

            const updatedIngredients = mealDetails.ingredients.filter(ing => ing.id !== ingredientId);
            setMealDetails({
                ...mealDetails,
                ingredients: updatedIngredients
            });
        } catch (error) {
            console.error('Error removing ingredient:', error);
        }
    };

    const fetchMealDetails = async () => {
        if (!selectedMeal) return;

        setLoading(true);
        setError(null);

        try {
            const response = await fetch(`/api/dish/${selectedMeal.id}`);
            if (!response.ok) {
                throw new Error('Failed to fetch meal details');
            }
            const data = await response.json();
            setMealDetails(data);
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    const filteredMeals = meals.filter((meal) =>
        meal.name.toLowerCase().includes(searchValue.toLowerCase())
    );

    const fetchAvailableIngredients = async () => {
        try {
            const response = await fetch('/api/ingredient');
            if (!response.ok) {
                throw new Error('Failed to fetch ingredients');
            }
            const data = await response.json();
            setAvailableIngredients(data);
        } catch (error) {
            console.error('Error fetching ingredients:', error);
        }
    };

    useEffect(() => {
        if (showIngredientModal) {
            fetchAvailableIngredients();
        }
    }, [showIngredientModal]);

    const renderIngredientModal = () => (
        <Modal show={showIngredientModal} onHide={() => setShowIngredientModal(false)}>
            <Modal.Header closeButton>
                <Modal.Title>Wybierz nowy sk³adnik</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <Form.Group>
                    <Form.Label>Dostêpne sk³adniki</Form.Label>
                    <div style={{ maxHeight: '300px', overflowY: 'auto' }}>
                        {availableIngredients.map(ingredient => (
                            <Button
                                key={ingredient.id}
                                variant="outline-primary"
                                className="m-1"
                                onClick={() => handleIngredientReplacement(ingredient.id)}
                            >
                                {ingredient.name}
                            </Button>
                        ))}

                        {pendingReplacements.length > 0 && (
                            <div className="mt-3">
                                <Button
                                    variant="primary"
                                    onClick={saveAllChanges}
                                >
                                    Zapisz wszystkie zmiany ({pendingReplacements.length})
                                </Button>
                            </div>
                        )}
                    </div>
                </Form.Group>
            </Modal.Body>
            <Modal.Footer>
                <Button variant="secondary" onClick={() => setShowIngredientModal(false)}>
                    Anuluj
                </Button>
            </Modal.Footer>
        </Modal>
    );

    const renderMealDetails = () => {
        if (!mealDetails) return null;
        return (
            <div>
                <h3>{mealDetails.name}</h3>
                <p>Lista sk³adników:</p>
                <div>
                    <ul className="list-unstyled">
                        {mealDetails.ingredients.map((ingredient) => (
                            <li key={ingredient.id} className="mb-2">
                                <InputGroup>
                                    <InputGroup.Text>{ingredient.name}</InputGroup.Text>
                                    <Form.Control
                                        type="number"
                                        value={ingredient.quantity}
                                        onChange={(e) => handleQuantityChange(ingredient.id, e.target.value)}
                                        style={{ maxWidth: '100px' }}
                                    />
                                    <InputGroup.Text>g</InputGroup.Text>
                                    <Button
                                        variant="warning"
                                        onClick={() => handleReplaceIngredient(ingredient.id)}
                                    >
                                        Zamieñ
                                    </Button>
                                    <Button
                                        variant="danger"
                                        onClick={() => handleRemoveIngredient(ingredient.id)}
                                    >
                                        Usuñ
                                    </Button>
                                </InputGroup>
                            </li>
                        ))}
                    </ul>
                </div>
                <p><strong>Description:</strong> {mealDetails.description || 'No description available'}</p>
                <p><strong>Calories:</strong> {mealDetails.kcal || 0} kcal</p>
                <p><strong>Protein:</strong> {mealDetails.protein || 0}g</p>
                <p><strong>Carbs:</strong> {mealDetails.carbo || 0}g</p>
                <p><strong>Fat:</strong> {mealDetails.fat || 0}g</p>
                {mealDetails.allergens && (
                    <>
                        <h4>Allergens:</h4>
                        <p>{mealDetails.allergens}</p>
                    </>
                )}
            </div>
        );
    };

    return (
        <>
            <Card style={{ width: '25rem' }}>
                <Card.Img variant="top" src={imagePath} alt={`${mealType} image`} />
                <Card.Body>
                    <Card.Title>{mealType}</Card.Title>
                    <Card.Text>{description}</Card.Text>
                    {selectedMeal && (
                        <>
                            <Card.Text className="mt-3">
                                Assigned Meal: <strong>{selectedMeal.name}</strong>
                            </Card.Text>
                            <Button
                                variant="secondary"
                                className="mt-2"
                                onClick={handleShowDetail}
                            >
                                Show Details
                            </Button>
                        </>
                    )}
                    <Button variant="primary" onClick={() => setShowModal(true)}>
                        Assign Meal
                    </Button>
                </Card.Body>
                </Card>


            <Modal show={showModal} onHide={() => setShowModal(false)}>
                <Modal.Header closeButton>
                    <Modal.Title>Assign a Meal</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Form.Group className="mb-3" controlId="mealSearch">
                        <Form.Label>Search Meals</Form.Label>
                        <Form.Control
                            type="text"
                            placeholder="Search for a meal..."
                            value={searchValue}
                            onChange={(e) => setSearchValue(e.target.value)}
                        />
                    </Form.Group>

                    <Dropdown>
                        <Dropdown.Toggle variant="success" id="dropdown-basic">
                            Select Meal
                        </Dropdown.Toggle>
                        <Dropdown.Menu>
                            {filteredMeals.map((meal) => {
                                if (!meal || !meal.id) {
                                    return null; 
                                }

                                return (
                                    <Dropdown.Item
                                        key={meal.id}
                                        onClick={() => {
                                            handleMealSelect(meal); 
                                            setShowModal(false);
                                        }}
                                    >
                                        {meal.name}
                                    </Dropdown.Item>
                                );
                            })}
                        </Dropdown.Menu>
                    </Dropdown>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={handleClose}>
                        Close
                    </Button>
                </Modal.Footer>
            </Modal>

             <Modal show={showModalDetail} onHide={handleCloseDetail}>
                <Modal.Header closeButton>
                    <Modal.Title>Meal details</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    {loading && <p>Loading...</p>}
                    {error && <p className="text-danger">Error: {error}</p>}
                    {!loading && !error && renderMealDetails()}
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={handleCloseDetail}>
                        Close
                    </Button>
                </Modal.Footer>
            </Modal>

            {renderIngredientModal()}
        </>
    );
}

export default MealCard;