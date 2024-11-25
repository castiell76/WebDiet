﻿import React from "react";
import NavbarBasic from './components/Navbar';
import IngredientList from './components/Ingredient/IngredientList';
import AddIngredient from "./components/Ingredient/AddIngredient";
import IngredientDetails from "./components/Ingredient/IngredientDetails";
import { AnimatePresence, motion } from "framer-motion";
import 'bootstrap/dist/css/bootstrap.min.css';
import './App.css';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';

function App() {
    return (
        <Router>
            <AnimatedApp />
        </Router>
    );
}

function AnimatedApp() {
    const location = useLocation();

    return (
        <>
            <NavbarBasic />
            <AnimatePresence>
                <Routes location={location} key={location.pathname}>
                    <Route path="/ingredients" element={
                        <PageTransition>
                            <IngredientList />
                        </PageTransition>} />
                    <Route path="/ingredients/add" element={
                        <PageTransition>
                            <AddIngredient />
                        </PageTransition>} />
                    <Route path="/ingredient/:id" element={
                        <PageTransition>
                            <IngredientDetails />
                        </PageTransition>} />
                </Routes>
            </AnimatePresence>
        </>
    );
}

const PageTransition = ({ children }) => (
    <motion.div
        initial={{ opacity: 0 }}         
        animate={{ opacity: 1 }}        
        exit={{ opacity: 0 }}            
        transition={{
            opacity: { duration: 0.8 },   
            exit: { duration: 0 },        
        }}
        style={{ position: "absolute", width: "100%" }} 
    >
        {children}
    </motion.div>
);
export default App;
