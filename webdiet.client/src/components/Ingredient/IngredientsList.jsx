﻿import React, { useState, useEffect } from "react";
import {Table,Form, Button} from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { BsPlus } from "react-icons/bs";
export default function IngredientList({}) {

    const [ingredients, setIngredients] = useState([]);
    const [searchQuery, setSearchQuery] = useState("");

    useEffect(() => {

        fetch('/api/ingredient', {
            method: 'GET',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
            },
            cache: "no-store"
        })
            .then(response => response.json())
            .then(data => {
                setIngredients(data); 
            })
            .catch(error => console.error("Error fetching ingredient:", error));
    }, []);

    const handleSearch = (e) => {
        setSearchQuery(e.target.value);
    };
    const handleAddMany = async (e) => {
        e.preventDefault();

        try {
            const response = await fetch("/api/ingredient/add-from-xls", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
            });

        } catch (error) {
            console.error("Error occurred:", error.response, error);
        }
    };

    const filteredIngredients = ingredients.filter((ingredient) =>
        ingredient.name.toLowerCase().includes(searchQuery.toLowerCase())
    );

    return (
        <div>
            <div className="d-flex justify-content-between mb-3 col-4">
                <Form.Control
                    type="text"
                    placeholder="Search ingredients"
                    value={searchQuery}
                    onChange={handleSearch}
                />
                <Button variant="primary" className="btn btn-primary ms-3">
                    <Link to="/ingredients/add" style={{ color: 'white', textDecoration: 'none' }}>
                        <BsPlus />
                    </Link>
                </Button>
                <Button variant="primary" className="btn btn-primary ms-3" onClick={handleAddMany }>
                    Dodaj wiele
                </Button>
            </div>
           
            <Table striped bordered hover>
                <thead>
                    <tr>
                        <th>Name</th>
                        <th>Kcal</th>
                        <th>Protein [g]</th>
                        <th>Carbo [g]</th>
                        <th>Fat [g]</th>
                        <th>Category</th>
                    </tr>
                </thead>
                <tbody>
                    {filteredIngredients.map((ingredient, index) => (
                        <tr key={index}>
                            <td>
                                <Link to={`/ingredient/${ingredient.id}`}>{ingredient.name}</Link>
                            </td>
                            
                            <td>{ingredient.kcal}</td>
                            <td>{ingredient.protein}</td>
                            <td>{ingredient.carbo}</td>
                            <td>{ingredient.fat}</td>
                            <td>{ingredient.category}</td>
                        </tr>
                    ))}
                </tbody>
            </Table>
        </div>
        
    );
}