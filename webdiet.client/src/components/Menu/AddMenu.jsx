import React, { useState, useEffect } from 'react';
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import MealCard from "../Meal/MealCard"
import { Button, Modal, Form, Dropdown, ButtonGroup, ToggleButton, Container } from 'react-bootstrap';


const CustomToggle = React.forwardRef(({ children, onClick }, ref) => (
    <Button
        ref={ref}
        onClick={(e) => {
            e.preventDefault();
            onClick(e);
        }}
    >
        {children} &#x25bc;
    </Button>
));
CustomToggle.displayName = 'CustomToggle';




const CustomMenu = React.forwardRef(
    ({ children, style, className, 'aria-labelledby': labeledBy }, ref) => {
        const [value, setValue] = useState('');

        return (
            <div
                ref={ref}
                style={style}
                className={className}
                aria-labelledby={labeledBy}
            >
                <Form.Control
                    autoFocus
                    className="mx-3 my-2 w-auto"
                    placeholder="Type to filter..."
                    onChange={(e) => setValue(e.target.value)}
                    value={value}
                />
                <ul className="list-unstyled px-2">
                    {React.Children.toArray(children).filter(
                        (child) =>
                            !value || child.props.children.toLowerCase().includes(value.toLowerCase())
                    )}
                </ul>
            </div>
        );
    }
);
CustomMenu.displayName = 'CustomMenu';

export default function AddMenu({ showToast }) {
    const [showModal, setShowModal] = useState(false);
    const [userData, setUserData] = useState({
        gender: "",
        age: "",
        weight: "",
        height: "",
        activity: "",
        jobActivity: "",
        goal: "",
        goalPace: "0"
    })
    const [formData, setFormData] = useState({
        description: "",
        date: new Date(),
        kcal: "",
        dishes: [],
    });

    const activityOptions = [
        { name: 'None physical activity' },
        { name: '1-2 trainings per week' },
        { name: '3-4 trainings per week' },
        { name: '5-7 trainings per week' },
        { name: 'more than 1 training per day' },
    ];

    const goals = [
        { name: 'Keep weight' },
        { name: 'Put on a weight' },
        { name: 'Loose weight' },
    ];

    const genders = [
        { name: 'Male' },
        { name: 'Female' },
        { name: 'Other' },
    ];

    const jobActivityOptions = [
        { name: 'sedentary work' },
        { name: 'moderate work activity' },
        { name: 'heavy work activity' },

    ];

    const mealImages = {
        Breakfast: "/assets/breakfast.jpg",
        Lunch: "/assets/lunch.jpg",
        Dinner: "/assets/dinner.jpg",
        Tea: "/assets/tea.jpg",
        Supper: "/assets/supper.jpg"
    };
    const [meals, setMeals] = useState([]);

    useEffect(() => {
        fetch("/api/dish")
            .then((response) => response.json())
            .then((data) => {
                setMeals(data);
            })
            .catch((error) => console.error("Error:", error));
    }, []);


    const [mealCount, setMealCount] = useState(0);

    const handleClose = () => setShowModal(false);


    const handleSelectChange = (event) => {
        const selectedValue = parseInt(event.target.value, 10);
        setMealCount(selectedValue);
    };

    const getMealTypes = (mealCount) => {
        switch (mealCount) {
            case 1:
                return ["Breakfast", "Dinner", "Supper"];
            case 2:
                return ["Breakfast", "Lunch", "Dinner", "Supper"];
            case 3:
                return ["Breakfast", "Lunch", "Dinner", "Tea", "Supper"];
            default:
                return [];
        }
    };


    const handleSubmitModal = async (e) => {
        e.preventDefault();
        try {
            const token = localStorage.getItem("jwtToken");
            console.log("userData: ", userData);

            const response = await fetch("/api/calculator/kcal", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${token}`
                },
                body: JSON.stringify(userData),
            });
        }
        catch (error) {
            console.error("Error occurred:", error.response, error);
            showToast("Error connecting with server.");
        };
    }
        const handleSubmit = async (e) => {
            e.preventDefault();

            try {
                const token = localStorage.getItem("jwtToken");

                const transformedData = {
                    ...formData,
                    dishes: formData.dishes.map(dish => ({
                        type: dish.type,
                        dishId: dish.id,

                    }))
                };

                const response = await fetch("/api/menu", {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                        "Authorization": `Bearer ${token}`
                    },
                    body: JSON.stringify(transformedData),
                });



                if (response.ok) {
                    showToast({ message: "Menu has been added!", variant: 'success' });

                    setFormData({
                        description: "",
                        date: new Date(),
                        kcal: "",
                        dishes: [],

                    });
                    console.log("sprawdzam...", formData)
                } else {
                    const errorData = await response.json();
                    console.error("Server error:", errorData);
                    showToast("Error occurred while adding the meal.");

                }
            } catch (error) {
                console.error("Error occurred:", error.response, error);
                showToast("Error connecting with server.");
            }
        };

        const handleRangeChange = (e) => {
            const value = parseFloat(e.target.value);
            setUserData(prev => ({
                ...prev,
                goalPace: value
            }));
        };

        const handleMealSelect = (mealType, selectedMeal) => {
            if (!selectedMeal || !selectedMeal.id) {
                console.error('Invalid meal selected:', selectedMeal);
                return;
            }

            setFormData((prev) => ({
                ...prev,
                dishes: [
                    ...prev.dishes.filter((dish) => dish.type !== mealType),
                    {
                        type: mealType,
                        id: selectedMeal.id,
                        name: selectedMeal.name,
                        ingredients: selectedMeal.ingredients || [],
                    },
                ],
            }));
        };
        const mealTypes = getMealTypes(mealCount);

        return (
            <Container>
                <h1>Add Menu</h1>
                <Form onSubmit={handleSubmit}>
                    <Form.Group className="mb-3" controlId="addMenu.date">
                        <Form.Label>Date</Form.Label>
                        <DatePicker
                            selected={formData.date}
                            onChange={(date) => setFormData({ ...formData, date })}
                            dateFormat="yyyy-MM-dd"
                        />
                    </Form.Group>
                    <Form.Group className="mb-3" controlId="addMenu.description">
                        <Form.Label>Description</Form.Label>
                        <Form.Control
                            type="text"
                            placeholder="Menu description - optional"
                            value={formData.description}
                            name="description"
                            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                        />
                    </Form.Group>
                    <Form.Group className="mb-3" controlId="addMenu.kcal">
                        <Form.Label>Kcal</Form.Label>
                        <Form.Control
                            type="number"
                            placeholder="Kcal total"
                            value={formData.kcal}
                            name="kcal"
                            onChange={(e) => setFormData({ ...formData, kcal: parseFloat(e.target.value) || 0 })}
                        />
                    </Form.Group>
                    <Button onClick={() => setShowModal(true)}>
                        Calculate KCal
                    </Button>

                    <Form.Select className="mb-3" aria-label="Meals quantity" onChange={handleSelectChange}>
                        <option>Choose meals quantity</option>
                        <option value="1">Three</option>
                        <option value="2">Four</option>
                        <option value="3">Five</option>
                    </Form.Select>
                    <div className="meal-cards d-flex justify-content-center align-items-center container py-4">
                        {mealTypes.map((mealType) => (
                            <MealCard
                                key={mealType}
                                mealType={mealType}
                                description={`Description for ${mealType.toLowerCase()}`}
                                imagePath={mealImages[mealType]}
                                meals={meals}
                                onMealSelect={(selectedMeal) => {
                                    handleMealSelect(mealType, selectedMeal);
                                }}
                            />
                        ))}
                    </div>

                    <Button type="submit" variant="primary" className="mt-3">
                        Add Menu
                    </Button>
                </Form>

                <Modal show={showModal} onHide={handleClose}>
                    <Modal.Header closeButton>
                        <Modal.Title>Calculate kCal</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>

                        <Form onSubmit={handleSubmitModal}>
                            <Form.Group className="mb-3" controlId="userData.jobActivity">
                                <Form.Label>Choose your goal</Form.Label>
                                <div className="d-flex flex-wrap gap-2">
                                    {genders.map((option, idx) => (
                                        <ToggleButton
                                            key={idx}
                                            id={`gender-${idx}`}
                                            type="radio"
                                            variant="outline-primary"
                                            name="gender"
                                            value={option.name}
                                            checked={userData.gender === option.name}
                                            onClick={(e) => {
                                                e.preventDefault();
                                                setUserData(prev => ({
                                                    ...prev,
                                                    gender: option.name
                                                }));
                                            }}
                                        >
                                            {option.name}
                                        </ToggleButton>
                                    ))}
                                </div>
                            </Form.Group>
                            <Form.Group className="mb-3" controlId="userData.age">
                                <Form.Label>Set your age</Form.Label>
                                <Form.Control
                                    type="number"
                                    placeholder="Age"
                                    value={userData.age}
                                    onChange={(e) => setUserData((prevUserData) => ({ ...prevUserData, age: e.target.value }))}
                                />
                            </Form.Group>
                            <Form.Group className="mb-3" controlId="userData.height">
                                <Form.Label>Set your height</Form.Label>
                                <Form.Control
                                    type="number"
                                    placeholder="Height [cm]"
                                    value={userData.height}
                                    onChange={(e) => setUserData((prevUserData) => ({ ...prevUserData, height: e.target.value }))}
                                />
                            </Form.Group>
                            <Form.Group className="mb-3" controlId="userData.weight">
                                <Form.Label>Set your weight</Form.Label>
                                <Form.Control
                                    type="number"
                                    placeholder="Weight [kg]"
                                    value={userData.weight}
                                    onChange={(e) => setUserData((prevUserData) => ({ ...prevUserData, weight: e.target.value }))}
                                />
                            </Form.Group>
                            <Form.Group className="mb-3" controlId="userData.activity">
                                <Form.Label>Choose your physical activity</Form.Label>
                                <div className="d-flex flex-wrap gap-2">
                                    {activityOptions.map((option, idx) => (
                                        <ToggleButton
                                            key={idx}
                                            id={`activity-${idx}`}
                                            type="radio"
                                            variant="outline-primary"
                                            name="activity"
                                            value={option.name}
                                            checked={userData.activity === option.name}
                                            onClick={(e) => {
                                                e.preventDefault();
                                                setUserData(prev => ({
                                                    ...prev,
                                                    activity: option.name
                                                }));
                                            }}
                                        >
                                            {option.name}
                                        </ToggleButton>
                                    ))}
                                </div>
                            </Form.Group>
                            <Form.Group className="mb-3" controlId="userData.jobActivity">
                                <Form.Label>Choose your job activity</Form.Label>
                                <div className="d-flex flex-wrap gap-2">
                                    {jobActivityOptions.map((option, idx) => (
                                        <ToggleButton
                                            key={idx}
                                            id={`jobActivity-${idx}`}
                                            type="radio"
                                            variant="outline-primary"
                                            name="jobActivity"
                                            value={option.name}
                                            checked={userData.jobActivity === option.name}
                                            onClick={(e) => {
                                                e.preventDefault();
                                                setUserData(prev => ({
                                                    ...prev,
                                                    jobActivity: option.name
                                                }));
                                            }}
                                        >
                                            {option.name}
                                        </ToggleButton>
                                    ))}
                                </div>
                            </Form.Group>
                            <Form.Group className="mb-3" controlId="userData.jobActivity">
                                <Form.Label>Choose your goal</Form.Label>
                                <div className="d-flex flex-wrap gap-2">
                                    {goals.map((option, idx) => (
                                        <ToggleButton
                                            key={idx}
                                            id={`goal-${idx}`}
                                            type="radio"
                                            variant="outline-primary"
                                            name="goal"
                                            value={option.name}
                                            checked={userData.goal === option.name}
                                            onClick={(e) => {
                                                e.preventDefault();
                                                setUserData(prev => ({
                                                    ...prev,
                                                    goal: option.name
                                                }));
                                            }}
                                        >
                                            {option.name}
                                        </ToggleButton>
                                    ))}
                                </div>
                            </Form.Group>
                            {userData.goal === 'Put on a weight' && (
                                <Form.Group className="mb-3" controlId="userData.goalPace">
                                    <Form.Label>Choose weight loss pace (kg/week)</Form.Label>
                                    <div>
                                        <Form.Range
                                            min={0.1}
                                            max={1.0}
                                            step={0.1}
                                            value={userData.goalPace || 0.1}
                                            onChange={handleRangeChange}
                                        />
                                        <div className="d-flex justify-content-between">
                                            <span>0.1 kg</span>
                                            <span>{userData.goalPace || 0.1} kg</span>
                                            <span>1.0 kg</span>
                                        </div>
                                    </div>
                                </Form.Group>
                            )}
                            {userData.goal === 'Loose weight' && (
                                <Form.Group className="mb-3" controlId="userData.goalPace">
                                    <Form.Label>Choose weight gain pace (kg/week)</Form.Label>
                                    <div>
                                        <Form.Range
                                            min={0.1}
                                            max={1.0}
                                            step={0.1}
                                            value={userData.goalPace || 0.1}
                                            onChange={handleRangeChange}
                                        />
                                        <div className="d-flex justify-content-between">
                                            <span>0.1 kg</span>
                                            <span>{userData.goalPace || 0.1} kg</span>
                                            <span>1.0 kg</span>
                                        </div>
                                    </div>
                                </Form.Group>
                            )}
                        </Form>

                    </Modal.Body>
                    <Modal.Footer>
                        <Button onClick={handleSubmitModal}>
                            Calculate
                        </Button>
                        <Button variant="secondary" onClick={handleClose}>
                            Close
                        </Button>
                    </Modal.Footer>
                </Modal>
            </Container>
        );
    }