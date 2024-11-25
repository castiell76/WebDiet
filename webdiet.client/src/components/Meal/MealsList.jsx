import React, { useState, useEffect } from "react";
import Table from 'react-bootstrap/Table';
import { Link } from 'react-router-dom';

export default function MealsList() {

    const [meals, setMeals] = useState([]);

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

    return (
        <Table striped bordered hover>
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
                    <tr key={index}>
                        <td>
                            <Link to={`/meal/${meal.id}`}>{meal.name}</Link>
                        </td>
                        <td>{meal.kcal}</td>
                        <td>{meal.protein}</td>
                        <td>{meal.carbo}</td>
                        <td>{meal.fat}</td>
                    </tr>
                ))}
            </tbody>
        </Table>
    );
}