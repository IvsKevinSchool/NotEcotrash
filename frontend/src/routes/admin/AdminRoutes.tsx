import React from 'react';
import { Route, Routes } from 'react-router-dom';

// Admin Views
import Index from '../../modules/admin/index';
import AddUser from '../../modules/admin/pages/AddUser';
import EcoForm from '../../modules/admin/components/UserEcoForm';
import { Panel } from '../../modules/admin/pages/Panel';
import ClientsList from '../../modules/client/ClientsList';
import ClientsItems from '../../modules/client/ClientsItem';
import { ListLocations } from '../../modules/locations/pages/ListLocations';
import { AddLocation } from '../../modules/locations/pages/AddLocation';
import { CreateWastePage } from '../../modules/waste/pages/CreateWastePage';
import { WasteListPage } from '../../modules/waste/components/WasteListPage';
import ManagementList from '../../modules/management/pages/ManagementList';
import CollectorUsers from '../../modules/collector/pages/CollectorUsers';
import ServicesIndex from '../../modules/services/pages/ServicesIndex';
import TypeServicesIndex from '../../modules/typeServices/components/TypeServicesIndex';
import CertificateIndex from '../../modules/certificate/pages/CertificateIndex';
import ClientsIndex from '../../modules/client/pages/ClientsIndex';

const AdminRoutes = () => {
    return (
        <Routes>
            <Route path="/" />
            <Route path="/dashboard" element={<Panel />} />
            <Route path="/clients" element={<ClientsIndex />} />
            <Route path="/clients/:id" element={<ClientsItems />} />
        </Routes>
    );
};

export default AdminRoutes;