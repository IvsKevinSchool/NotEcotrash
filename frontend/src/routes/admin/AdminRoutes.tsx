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
            <Route path="add-user" element={<AddUser />} />
            <Route path="eco-form" element={<EcoForm />} />

            <Route path="/dashboard" element={<Panel />} />
            <Route path="/clients" element={<ClientsIndex />} />
            <Route path="/clients/:id" element={<ClientsItems />} />
            {/* Location Module */}
            <Route path="/locations" element={<ListLocations />} />
            <Route path="/locations/add" element={<AddLocation />} />
            <Route path="/locations/edit/:pk" element={<AddLocation />} />
            {/* Waste Module */}
            <Route path="/wastes" element={<WasteListPage />} />
            <Route path="/wastes/add" element={<CreateWastePage />} />
            <Route path="/wastes/edit/:pk" element={<CreateWastePage />} />
            {/* Management Module */}
            <Route path="/management" element={<ManagementList />} />
            {/* Collector Module */}
            <Route path="/collector" element={<CollectorUsers />} />
            {/* Services Module */}
            <Route path="/services" element={<ServicesIndex />} />
            <Route path="/typeServices" element={<TypeServicesIndex />} />
            {/* Certificate Module */}
            <Route path="/certificate" element={<CertificateIndex />} />
        </Routes>
    );
};

export default AdminRoutes;