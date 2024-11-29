import React, { useState } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';

const LoginForm = () => {
    const [formData, setFormData] = useState({
        email: '',
        password: '',
        rememberMe: false
    });
    const [errors, setErrors] = useState({});
    const [isLoading, setIsLoading] = useState(false);

    const validateForm = () => {
        const newErrors = {};

        // Email validation
        if (!formData.email) {
            newErrors.email = 'Email jest wymagany';
        } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
            newErrors.email = 'Nieprawid³owy format email';
        }

        // Password validation
        if (!formData.password) {
            newErrors.password = 'Has³o jest wymagane';
        } else if (formData.password.length < 6) {
            newErrors.password = 'Has³o musi mieæ minimum 6 znaków';
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
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (validateForm()) {
            setIsLoading(true);
            try {
                // Tutaj dodaj logikê logowania
                console.log('Form submitted:', formData);
                await new Promise(resolve => setTimeout(resolve, 1000)); // Symulacja API call
            } catch (error) {
                console.error('Login error:', error);
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

export default LoginForm;