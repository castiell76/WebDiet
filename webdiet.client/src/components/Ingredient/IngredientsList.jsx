import React, { useState, useEffect } from "react";
import Table from 'react-bootstrap/Table';
import { Link } from 'react-router-dom';

export default function IngredientsList() {

    const [ingredients, setIngredients] = useState([]);

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
                console.log("Fetched ingredient data:", data);
                setIngredients(data); 
            })
            .catch(error => console.error("Error fetching ingredient:", error));
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
              {ingredients.map((ingredient, index) => (
                <tr key={index}>
                      <td>
                          <Link to={`/ingredient/${ingredient.id}`}>{ingredient.name}</Link>
                      </td>
                  <td>{ingredient.kcal}</td>
                  <td>{ingredient.protein}</td>
                  <td>{ingredient.carbo}</td>
                  <td>{ingredient.fat}</td>
                </tr>
              ))}
            </tbody>
    </Table>
    );
}