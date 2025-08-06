import { Route, Routes } from 'react-router-dom';

// Client Views
import { Panel } from '../../modules/admin/pages/Panel';
import CollectorService from '../../modules/collector/pages/CollectorService';

const CollectorRoutes = () => {
    return (
        <Routes>
            <Route path="/" />
            <Route path="/dashboard" element={<Panel />} />
            <Route path="/services" element={<CollectorService />} />
        </Routes>
    );
};

export default CollectorRoutes;