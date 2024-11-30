
import { createRoot } from 'react-dom/client'
import App from './App.jsx'
import './custom.css';
import { AuthProvider } from './contexts/AuthContext';

createRoot(document.getElementById('root')).render(

        <AuthProvider>
            <App />
        </AuthProvider>


)
