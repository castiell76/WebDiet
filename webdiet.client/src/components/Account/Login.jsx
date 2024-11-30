import React, { useState } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { jwtDecode } from "jwt-decode";  // Correct import for jwt-decode

const Login = () => {
    const { login } = useAuth();
    const [formData, setFormData] = useState({
        email: '',
        password: '',
        rememberMe: false
    });
    const [errors, setErrors] = useState({});
    const [isLoading, setIsLoading] = useState(false);
    const [apiError, setApiError] = useState('');
    const navigate = useNavigate();

    const validateForm = () => {
        const newErrors = {};

        if (!formData.email) {
            newErrors.email = 'Email jest wymagany';
        } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
            newErrors.email = 'Nieprawid³owy format email';
        }

        if (!formData.password) {
            newErrors.password = 'Has³o jest wymagane';
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        setFormData(prevData => ({
            ...prevData,
            [name]: type === 'checkbox' ? checked : value
        }));
        setApiError('');
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setApiError('');

        if (validateForm()) {
            setIsLoading(true);
            try {
                const response = await axios.post('/api/account/login', {
                    email: formData.email,
                    password: formData.password
                });
                console.log(response.data); 
                const token = response.data;
                console.log('Received token:', token);
                // Ensure the token is a string before attempting to decode it
                if (typeof token !== 'string') {
                    throw new Error('Invalid token');
                }

                // Decode the token to extract user data
                const decodedUser = jwtDecode(token);

                // Calling the login function to store the user and token in context
                login(decodedUser, token);

                const storage = formData.rememberMe ? localStorage : sessionStorage;
                storage.setItem('jwtToken', token);

                axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;

                navigate('/ingredients');
            } catch (error) {
                console.error('Login error:', error);
                setApiError('Wyst¹pi³ b³¹d podczas logowania. Spróbuj ponownie.');
                if (error.response) {
                    switch (error.response.status) {
                        case 401:
                            setApiError('Nieprawid³owy email lub has³o');
                            break;
                        case 400:
                            setApiError('Nieprawid³owe dane logowania');
                            break;
                        default:
                            setApiError('Wyst¹pi³ b³¹d podczas logowania. Spróbuj ponownie.');
                    }
                } else if (error.request) {
                    setApiError('Nie mo¿na po³¹czyæ siê z serwerem. SprawdŸ po³¹czenie internetowe.');
                } else {
                    setApiError('Wyst¹pi³ nieoczekiwany b³¹d. Spróbuj ponownie.');
                }
            } finally {
                setIsLoading(false);
            }
        }
    };


    return (
        <div className="container">
            <div className="row justify-content-center mt-5">
                <div className="col-md-6 col-lg-4">
                    <div className="card shadow">
                        <div className="card-body">
                            <h3 className="card-title text-center mb-4">Logowanie</h3>

                            {apiError && (
                                <div className="alert alert-danger" role="alert">
                                    {apiError}
                                </div>
                            )}

                            <form onSubmit={handleSubmit}>
                                <div className="mb-3">
                                    <label htmlFor="email" className="form-label">Email</label>
                                    <input
                                        type="email"
                                        className={`form-control ${errors.email ? 'is-invalid' : ''}`}
                                        id="email"
                                        name="email"
                                        value={formData.email}
                                        onChange={handleChange}
                                        placeholder="WprowadŸ email"
                                    />
                                    {errors.email && <div className="invalid-feedback">{errors.email}</div>}
                                </div>

                                <div className="mb-3">
                                    <label htmlFor="password" className="form-label">Has³o</label>
                                    <input
                                        type="password"
                                        className={`form-control ${errors.password ? 'is-invalid' : ''}`}
                                        id="password"
                                        name="password"
                                        value={formData.password}
                                        onChange={handleChange}
                                        placeholder="WprowadŸ has³o"
                                    />
                                    {errors.password && <div className="invalid-feedback">{errors.password}</div>}
                                </div>

                                <div className="mb-3 form-check">
                                    <input
                                        type="checkbox"
                                        className="form-check-input"
                                        id="rememberMe"
                                        name="rememberMe"
                                        checked={formData.rememberMe}
                                        onChange={handleChange}
                                    />
                                    <label className="form-check-label" htmlFor="rememberMe">
                                        Zapamiêtaj mnie
                                    </label>
                                </div>

                                <button
                                    type="submit"
                                    className="btn btn-primary w-100"
                                    disabled={isLoading}
                                >
                                    {isLoading ? (
                                        <>
                                            <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                                            Logowanie...
                                        </>
                                    ) : (
                                        'Zaloguj siê'
                                    )}
                                </button>
                            </form>

                            <div className="mt-3 text-center">
                                <a href="#" className="text-decoration-none">Zapomnia³eœ has³a?</a>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Login;
