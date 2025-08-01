import { Route, BrowserRouter as Router, Routes } from 'react-router-dom';

// Layout
import Layout from './layout/Layout';
import Home from './layout/Home';

// Auth Views
import Login from './auth/Login';
import Register from './auth/Register';

// Modules Views
import AdminRoutes from './routes/admin/AdminRoutes';
import { LayoutECO } from './layout/LayoutECO';
import NotFound from './layout/NotFound';
import { ManagementRoutes } from './routes/management/ManagementRoutes';
import WasteRoutes from './modules/waste/routes/WasteRoutes';

const AppRoutes = () => (
    <Router>
        <Routes>
            {/* Public routes */}
            <Route index element={<Home />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />


            {/* Protected routes */}
            <Route element={<LayoutECO />}>
                <Route path="/admin/*" element={<AdminRoutes />} />
            </Route>

            {/* management Routes */}
            <Route element={<LayoutECO />}>
                <Route path="/management/*" element={<ManagementRoutes />} />
            </Route>

            {/* waste Routes */}
            <Route element={<LayoutECO />}>
                <Route path="/waste/*" element={<WasteRoutes />} />
            </Route>

            <Route path='*' element={<NotFound />} />
        </Routes>
    </Router>
);

export default AppRoutes;
