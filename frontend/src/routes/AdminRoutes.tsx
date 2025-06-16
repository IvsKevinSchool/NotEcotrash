import React from 'react';
import { Route, Routes } from 'react-router-dom';

// Admin Views
import Index from '../modules/admin/index';
import AddUser from '../modules/admin/pages/AddUser';

const AdminRoutes = () => {
    return(
        <Routes>
            <Route path="/" element={<Index />} />
            <Route path="add-user" element={<AddUser />} />
        </Routes>
    );
};

export default AdminRoutes;