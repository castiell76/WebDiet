import React, { createContext, useContext, useState } from 'react';
import ToastCustom from '../components/Commons/ToastCustom';

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [toastText, setToastText] = useState('');
    const [toastVariant, setToastVariant] = useState('');
    const [toastVisible, setToastVisible] = useState(false);

    const showToast = ({ message, variant }) => {
        setToastText(message);
        setToastVariant(variant);
        setToastVisible(true);
    };


    const login = (userData, token) => {
        setUser(userData);
        localStorage.setItem('jwtToken', token);
    };

    const logout = () => {
        setUser(null);
        showToast({ message: "Zosta³eœ wylogowany", variant: 'secondary' });
        localStorage.removeItem('jwtToken');
        sessionStorage.removeItem('jwtToken');
        
    };

    return (
        <AuthContext.Provider value={{ user, login, logout,toastText,toastVariant, toastVisible, showToast }}>
            {children}
        </AuthContext.Provider>
    );
};