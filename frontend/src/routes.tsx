import { Route, BrowserRouter as Router, Routes } from 'react-router-dom';

// Layout
import Layout from './layout/Layout';

// Auth components
import Login from './auth/Login';
import Register from './auth/Register';

// View Components
import Index from './modules/admin/index';

const AppRoutes = () => (
    <Router>
        <Routes>
            {/* Public routes */}
            <Route index element={<Index />} />
            <Route path="/login" element={<Login />} />

            {/* Protected routes */}
            <Route element={<Layout />}>
                {/* <Route path="quotation/*" element={<QuotationRoutes />} /> */}
            </Route>
        </Routes>
    </Router>
);

export default AppRoutes;
