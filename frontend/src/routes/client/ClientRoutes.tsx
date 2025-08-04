import { Route, Routes } from 'react-router-dom';

// Client Views
import { Panel } from '../../modules/admin/pages/Panel';
import { ClienteProfile } from '../../modules/client/pages/ClienteProfile';
import ListCertificate from '../../modules/client/pages/ListCertificate';
import ServicesIndex from '../../modules/services/pages/ServicesIndex';
import RecurringServicesIndex from '../../modules/services/pages/RecurringServicesIndex';

const ClientRoutes = () => {
    return (
        <Routes>
            <Route path="/" />
            <Route path="/dashboard" element={<Panel />} />
            <Route path="/profile" element={<ClienteProfile />} />
            <Route path="/certificate" element={<ListCertificate />} />
            <Route path="/services" element={<ServicesIndex />} />
            <Route path="/recurring-services" element={<RecurringServicesIndex />} />
        </Routes>
    );
};

export default ClientRoutes;