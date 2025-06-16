import React from 'react';
import { Route, Routes } from 'react-router-dom';

// Admin Views
import Index from '../modules/admin/index';

const AdminRoutes = () => {
    return(
        <Routes>
            <Route path="/" element={<Index />} />
        </Routes>
    );
};

export default AdminRoutes;