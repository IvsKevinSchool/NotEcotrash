import { Route, Routes } from 'react-router-dom';

// Client Views
import { Panel } from '../../modules/admin/pages/Panel';
import { ClienteProfile } from '../../modules/client/pages/ClienteProfile';

const ClientRoutes = () => {
    return (
        <Routes>
            <Route path="/" />
            <Route path="/dashboard" element={<Panel />} />
            <Route path="/profile" element={<ClienteProfile />} />
        </Routes>
    );
};

export default ClientRoutes;