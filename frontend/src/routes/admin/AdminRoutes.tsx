import React from 'react';
import { Route, Routes } from 'react-router-dom';

// Admin Views
import { Panel } from '../../modules/admin/pages/Panel';
import ManagementManager from '../../modules/admin/pages/ManagementManager';

const AdminRoutes = () => {
    return (
        <Routes>
            <Route path="/" />
            <Route path="/dashboard" element={<Panel />} />
            <Route path="/clients" element={<ManagementManager />} />
        </Routes>
    );
};

export default AdminRoutes;