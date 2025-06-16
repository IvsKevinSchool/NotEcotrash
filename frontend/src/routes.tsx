import { Route, BrowserRouter as Router, Routes } from 'react-router-dom';

// Layout
import Layout from './layout/Layout';
import Home from './layout/Home';

// Auth Views
import Login from './auth/Login';
import Register from './auth/Register';

// Modules Views
import AdminRoutes from './routes/AdminRoutes';

const AppRoutes = () => (
    <Router>
        <Routes>
            {/* Public routes */}
            <Route index element={<Home />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            

            {/* Protected routes */}
            <Route element={<Layout />}>
                <Route path="/admin/*" element={<AdminRoutes />} />
            </Route>
        </Routes>
    </Router>
);

export default AppRoutes;
