import { Route, Routes } from 'react-router-dom';

// Collector Views
import { Panel } from '../../modules/admin/pages/Panel';
import { CollectorServicesPage } from '../../modules/services/pages/CollectorServicesPage';

const CollectorRoutes = () => {
    return (
        <Routes>
            <Route path="/" />
            <Route path="/dashboard" element={<Panel />} />
            <Route path="/services" element={<CollectorServicesPage />} />
        </Routes>
    );
};

export default CollectorRoutes;
