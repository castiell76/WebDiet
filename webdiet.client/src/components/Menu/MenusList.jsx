import React, { useState, useEffect } from "react";
import Table from 'react-bootstrap/Table';
import { useNavigate } from 'react-router-dom';
export default function MenusList() {

    const [menus, setMenus] = useState([]);
    const navigate = useNavigate();

    useEffect(() => {

        fetch('/api/menu', {
            method: 'GET',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
            },
            cache: "no-store"
        })
            .then(response => response.json())
            .then(data => {
                console.log("Fetched menu data:", data);
                setMenus(data);
            })
            .catch(error => console.error("Error fetching menu:", error));
    }, []);

    return (
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
                {menus.map((menu, index) => (
                    <tr
                        key={index}
                        onClick={() => navigate(`/menu/${menu.id}`)}
                        style={{ cursor: 'pointer' }}
                    >
                        <td>{menu.date}</td>
                        <td>{menu.kcal}</td>
                        <td>{menu.protein}</td>
                        <td>{menu.carbo}</td>
                        <td>{menu.fat}</td>
                    </tr>
                ))}
            </tbody>
        </Table>
    );
}