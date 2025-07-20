import { Route, Routes } from 'react-router-dom'
import { Panel } from '../../modules/admin/pages/Panel'
import ClientsIndex from '../../modules/client/pages/ClientsIndex'
import { WasteListPage } from '../../modules/waste/components/WasteListPage'
import CollectorUsers from '../../modules/collector/pages/CollectorUsers'
import ServicesIndex from '../../modules/services/pages/ServicesIndex'
import TypeServicesIndex from '../../modules/typeServices/components/TypeServicesIndex'
import CertificateIndex from '../../modules/certificate/pages/CertificateIndex'
import { ListLocations } from '../../modules/locations/pages/ListLocations'
import { AddLocation } from '../../modules/locations/pages/AddLocation'
import EditCollector from '../../modules/collector/pages/EditCollector'

export const ManagementRoutes = () => {
    return (
        <Routes>
            <Route path="/" element={<Panel />} />

            {/* Clients Module */}
            <Route path="/clients" element={<ClientsIndex />} />

            {/* Reports Module */}
            <Route path="/reports" element={<div>Bitacoras Index</div>} /> {/* Pending Bitacoras Index Component */}

            {/* Location Module */}
            <Route path="/locations" element={<ListLocations />} />
            <Route path="/locations/add" element={<AddLocation />} />
            <Route path="/locations/edit/:pk" element={<AddLocation />} />

            {/* Waste Module */}
            <Route path="/waste" element={<WasteListPage />} />

            {/* Collector Module */}
            <Route path="/collector" element={<CollectorUsers />} />
            <Route path="/collector/edit/:id" element={<EditCollector />} />

            {/* Services Module */}
            <Route path="/services" element={<ServicesIndex />} />
            <Route path="/type-services" element={<TypeServicesIndex />} />

            {/* Certificate Module */}
            <Route path="/certificate" element={<CertificateIndex />} />

        </Routes>
    )
}
