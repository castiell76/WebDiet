import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Card, Button, Container, Row, Col } from 'react-bootstrap';
import MealDetails from './MealDetails';

const MealView = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [mealBasicInfo, setMealBasicInfo] = useState(null);
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchMealBasicInfo = async () => {
            try {
                const response = await fetch(`/api/dish/${id}`);
                if (!response.ok) {
                    throw new Error('Failed to fetch meal information');
                }
                const data = await response.json();
                setMealBasicInfo(data);
                console.log(mealBasicInfo);
            } catch (err) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };

        if (id) {
            fetchMealBasicInfo();
        }
    }, [id]);

    if (loading) {
        return (
            <Container className="mt-4">
                <div>Loading...</div>
            </Container>
        );
    }

    if (error) {
        return (
            <Container className="mt-4">
                <div className="text-danger">Error: {error}</div>
                <Button variant="primary" onClick={() => navigate('/meals')} className="mt-3">
                    Back to Meals List
                </Button>
            </Container>
        );
    }

    return (
        <Container className="mt-4">
            <Row>
                <Col>
                    <Button variant="primary" onClick={() => navigate('/meals')} className="mb-4">
                        Back to Meals List
                    </Button>
                </Col>
            </Row>
            <Row>
                <Col md={4}>
                    <Card className="mb-4">
                        <Card.Body>
                            <Card.Title>{mealBasicInfo?.name}</Card.Title>
                            <div className="mt-3">
                                <p><strong>Calories:</strong> {mealBasicInfo?.kcal} kcal</p>
                                <p><strong>Protein:</strong> {mealBasicInfo?.protein}g</p>
                                <p><strong>Carbs:</strong> {mealBasicInfo?.carbo}g</p>
                                <p><strong>Fat:</strong> {mealBasicInfo?.fat}g</p>
                                <p><strong>Types: </strong></p>
                                {mealBasicInfo?.types.map((type, index) => (
                                    <li key={index}>{type}</li>
                                ))}
                                <p><strong>Allergens: </strong></p>
                                {mealBasicInfo?.allergens.map((allergen, index) => (
                                    <li key={index}>{allergen}</li>
                                ))}
                            </div>
                        </Card.Body>
                    </Card>
                   
                </Col>
                <Col md={8}>
                    <Card>
                        <Card.Body>
                            <Card.Title>Ingredients and Customization</Card.Title>
                            <MealDetails
                                mealId={id}
                                isCustomDish={false}
                                onClose={() => navigate('/meals')}
                                onSave={(customDishId) => {
                                }}
                            />
                        </Card.Body>
                    </Card>
                </Col>
            </Row>
        </Container>
    );
};

export default MealView;