import { Route, Routes } from 'react-router-dom';

// Client Views
import { ClientDashboard } from '../../modules/client/pages/ClientDashboard';
import { ClienteProfile } from '../../modules/client/pages/ClienteProfile';
import ListCertificate from '../../modules/client/pages/ListCertificate';
import { ClientServicesPage } from '../../modules/services/pages/ClientServicesPage';

const ClientRoutes = () => {
    return (
        <Routes>
            <Route path="/" element={<ClientDashboard />} />
            <Route path="/dashboard" element={<ClientDashboard />} />
            <Route path="/services" element={<ClientServicesPage />} />
            <Route path="/profile" element={<ClienteProfile />} />
            <Route path="/certificate" element={<ListCertificate />} />
        </Routes>
    );
};

export default ClientRoutes;