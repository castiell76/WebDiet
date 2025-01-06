import React, { useState, useEffect } from "react";
import Table from 'react-bootstrap/Table';
import Button from 'react-bootstrap/Button';
import { useNavigate } from 'react-router-dom';
export default function MealsList() {

    const [meals, setMeals] = useState([]);
    const navigate = useNavigate();

    useEffect(() => {

        fetch('/api/dish', {
            method: 'GET',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
            },
            cache: "no-store"
        })
            .then(response => response.json())
            .then(data => {
                console.log("Fetched meal data:", data);
                setMeals(data);
            })
            .catch(error => console.error("Error fetching meal:", error));
    }, []);

    const handleCreateRandomDishes = async (e) => {
        e.preventDefault();
        try {

            const response = await fetch("/api/dish/create-random-dishes", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
            });


        }
        catch (error) {
            console.error("Error occurred:", error.response, error);
        };
    }

    return (
        <div>
            <Table
                striped
                bordered
                hover
                className="m-3"
            >
                <thead>
                    <tr>
                        <th>Name</th>
                        <th>Kcal</th>
                        <th>Protein [g]</th>
                        <th>Carbo [g]</th>
                        <th>Fat [g]</th>
                    </tr>
                </thead>
                <tbody>
                    {meals.map((meal, index) => (
                        <tr
                            key={index}
                            onClick={() => navigate(`/meal/${meal.id}`)}
                            style={{ cursor: 'pointer' }}
                        >
                            <td>{meal.name}</td>
                            <td>{meal.kcal}</td>
                            <td>{meal.protein}</td>
                            <td>{meal.carbo}</td>
                            <td>{meal.fat}</td>
                        </tr>
                    ))}
                </tbody>
            </Table>
            <Button onClick={handleCreateRandomDishes }> Create random dishes</Button>
        </div>
       
    );
}