import { React, useState } from "react";
import NavbarBasic from './components/Navbar';
import IngredientsList from './components/Ingredient/IngredientsList';
import AddIngredient from "./components/Ingredient/AddIngredient";
import IngredientDetails from "./components/Ingredient/IngredientDetails";
import AddMeal from "./components/Meal/AddMeal"
import MealsList from "./components/Meal/MealsList"
import MealDetails from "./components/Meal/MealDetails"
import { AnimatePresence, motion } from "framer-motion";
import 'bootstrap/dist/css/bootstrap.min.css';
import './App.css';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import ToastCustom from "./components/Commons/ToastCustom";
import LoginForm from "./components/Account/Login";

function App() {
    const [toastVisible, setToastVisible] = useState(false);
    const [toastText, setToastText] = useState("");

    const showToast = (text) => {
        setToastText(text);
        setToastVisible(true);
    };

    return (
        <Router>
            <NavbarBasic />
            <ToastCustom
                text={toastText}
                show={toastVisible}
                onClose={() => setToastVisible(false)}
            />
            <AnimatedApp showToast={showToast} />
        </Router>
    );
}

function AnimatedApp({ showToast }) {
    const location = useLocation();

    return (
        <AnimatePresence>
            <Routes location={location} key={location.pathname}>
                <Route path="/ingredients" element={
                    <PageTransition>
                        <IngredientsList showToast={showToast} />
                    </PageTransition>}
                />
                <Route path="/ingredients/add" element={
                    <PageTransition>
                        <AddIngredient showToast={showToast} />
                    </PageTransition>}
                />
                <Route path="/ingredient/:id" element={
                    <PageTransition>
                        <IngredientDetails showToast={showToast} />
                    </PageTransition>}
                />
                <Route path="/meal/:id" element={
                    <PageTransition>
                        <MealDetails showToast={showToast} />
                    </PageTransition>}
                />
                <Route path="/meals/add" element={
                    <PageTransition>
                        <AddMeal showToast={showToast} />
                    </PageTransition>}
                />
                <Route path="/meals/" element={
                    <PageTransition>
                        <MealsList showToast={showToast} />
                    </PageTransition>}
                />
                <Route path="/account/login" element={
                    <PageTransition>
                        <LoginForm showToast={showToast} />
                    </PageTransition>}
                />
            </Routes>
        </AnimatePresence>
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
