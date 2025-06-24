import React from 'react';
import { Route, Routes } from 'react-router-dom';

// Admin Views
import Index from '../../modules/admin/index';
import AddUser from '../../modules/admin/pages/AddUser';
import EcoForm from '../../modules/admin/components/UserEcoForm';
import { Panel } from '../../modules/admin/pages/Panel';
import ClientsList from '../../modules/client/ClientsList';
import ClientsItems from '../../modules/client/ClientsItem';

const AdminRoutes = () => {
    return (
        <Routes>
            <Route path="/" />
            <Route path="add-user" element={<AddUser />} />
            <Route path="eco-form" element={<EcoForm />} />
            
            <Route path="/dashboard" element={<Panel />} />
            <Route path="/clients" element={<ClientsList />} />
            <Route path="/clients/:id" element={<ClientsItems />} />
        </Routes>
    );
};

export default AdminRoutes;