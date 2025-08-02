import React from 'react';
import { Route, Routes } from 'react-router-dom';

// Admin Views
import { Panel } from '../../modules/admin/pages/Panel';
import ManagementList from '../../modules/management/pages/ManagementList';

const AdminRoutes = () => {
    return (
        <Routes>
            <Route path="/" />
            <Route path="/dashboard" element={<Panel />} />
            <Route path="/clients" element={<ManagementList />} />
        </Routes>
    );
};

export default AdminRoutes;