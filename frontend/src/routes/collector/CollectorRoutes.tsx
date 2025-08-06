import { Route, Routes } from 'react-router-dom';

// Collector Views
import { CollectorDashboard } from '../../modules/collector/pages/CollectorDashboard';
import { CollectorServicesPage } from '../../modules/services/pages/CollectorServicesPage';

const CollectorRoutes = () => {
    return (
        <Routes>
            <Route path="/" element={<CollectorDashboard />} />
            <Route path="/dashboard" element={<CollectorDashboard />} />
            <Route path="/services" element={<CollectorServicesPage />} />
        </Routes>
    );
};


export default CollectorRoutes;


