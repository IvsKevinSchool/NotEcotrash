import { useEffect, useState } from 'react';
import { useAuth } from '../../../context/AuthContext';
import { ClientService } from '../services/clientService';
import { FiFileText, FiDownload, FiCalendar, FiUser } from 'react-icons/fi';
import { Spinner } from './Spinner'; // Componente de spinner personalizado

interface Certificate {
    pk_certificate: number;
    certificate_name: string;
    pdf: string;
    created_at: string;
}

export default function ListCertificate() {
    const { user } = useAuth();
    const [certificates, setCertificates] = useState<Certificate[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchCertificates = async () => {
            setLoading(true);
            setError(null);
            try {
                const data = await ClientService.getCertificatesByClient(user.id);
                setCertificates(data.certificates || []);
            } catch (err) {
                setError('Error al cargar los certificados. Por favor intenta nuevamente.');
                setCertificates([]);
            } finally {
                setLoading(false);
            }
        };

        if (user.id) fetchCertificates();
    }, [user.id]);

    return (
        <div className="min-h-screen bg-green-50 py-8 px-4 sm:px-6 lg:px-8">
            <div className="max-w-4xl mx-auto">
                {/* Encabezado con estilo ecológico */}
                <div className="text-center mb-8">
                    <h1 className="text-3xl font-bold text-green-800 mb-2">Certificados Ambientales</h1>
                    <p className="text-green-600">
                        Documentos que validan tu compromiso con la sostenibilidad
                    </p>
                    <div className="mt-4 flex items-center justify-center space-x-2 text-green-700">
                        <FiUser className="text-lg" />
                        <span>Cliente: {user.name || user.email}</span>
                    </div>
                </div>

                {/* Tarjeta contenedora */}
                <div className="bg-white rounded-xl shadow-lg overflow-hidden border border-green-200">
                    {/* Barra de título */}
                    <div className="bg-green-600 px-6 py-4 flex items-center">
                        <FiFileText className="text-white text-xl mr-2" />
                        <h2 className="text-xl font-semibold text-white">Mis Certificados</h2>
                    </div>

                    {/* Contenido */}
                    <div className="p-6">
                        {loading ? (
                            <div className="flex flex-col items-center justify-center py-12">
                                <Spinner className="text-green-500 h-12 w-12 mb-4" />
                                <p className="text-green-700">Cargando tus certificados...</p>
                            </div>
                        ) : error ? (
                            <div className="bg-red-50 border-l-4 border-red-500 p-4 mb-6">
                                <div className="flex">
                                    <div className="flex-shrink-0">
                                        <svg className="h-5 w-5 text-red-500" viewBox="0 0 20 20" fill="currentColor">
                                            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                                        </svg>
                                    </div>
                                    <div className="ml-3">
                                        <p className="text-sm text-red-700">{error}</p>
                                    </div>
                                </div>
                            </div>
                        ) : certificates.length === 0 ? (
                            <div className="text-center py-12">
                                <svg className="mx-auto h-12 w-12 text-green-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                                </svg>
                                <h3 className="mt-2 text-lg font-medium text-green-900">No hay certificados disponibles</h3>
                                <p className="mt-1 text-sm text-green-600">Parece que aún no tienes certificados asociados a tu cuenta.</p>
                            </div>
                        ) : (
                            <ul className="space-y-4">
                                {certificates.map(cert => (
                                    <li key={cert.pk_certificate} className="border border-green-100 rounded-lg overflow-hidden hover:shadow-md transition-shadow duration-200">
                                        <div className="flex flex-col sm:flex-row sm:items-center justify-between p-4 bg-green-50">
                                            <div className="flex items-start space-x-4">
                                                <div className="flex-shrink-0 bg-green-100 p-3 rounded-lg">
                                                    <FiFileText className="h-6 w-6 text-green-600" />
                                                </div>
                                                <div>
                                                    <h3 className="text-lg font-medium text-green-800">{cert.certificate_name}</h3>
                                                    <div className="mt-1 flex items-center text-sm text-green-600">
                                                        <FiCalendar className="mr-1.5 h-4 w-4 flex-shrink-0" />
                                                        <span>Emitido el {new Date(cert.created_at).toLocaleDateString('es-ES', {
                                                            year: 'numeric',
                                                            month: 'long',
                                                            day: 'numeric'
                                                        })}</span>
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="mt-4 sm:mt-0">
                                                <a
                                                    href={cert.pdf}
                                                    target="_blank"
                                                    rel="noopener noreferrer"
                                                    className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 transition-colors duration-200"
                                                >
                                                    <FiDownload className="mr-2 h-4 w-4" />
                                                    Descargar PDF
                                                </a>
                                            </div>
                                        </div>
                                    </li>
                                ))}
                            </ul>
                        )}
                    </div>

                    {/* Pie de página ecológico */}
                    <div className="bg-green-50 px-6 py-3 text-center border-t border-green-100">
                        <p className="text-xs text-green-600">
                            Cada certificado digital ahorra aproximadamente 10 hojas de papel. ¡Gracias por cuidar el medio ambiente!
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}