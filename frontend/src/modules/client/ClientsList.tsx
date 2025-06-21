import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Loading } from '../../layout/Loading';
import { LoadingWrapper } from '../../layout/LoadingWrapper';
import { IUserJSONPlaceHolder } from '../../interfaces';

export default function ClientsList() {
    const [users, setUsers] = useState<IUserJSONPlaceHolder[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        setIsLoading(true);
        fetch('https://jsonplaceholder.typicode.com/users')
            .then((response) => response.json())
            .then((data) => {
                setUsers(data);
                setIsLoading(false);
            })
            .catch((error) => {
                console.log('Error fetching users: ', error);
                setError(error);
                setIsLoading(false);
            });
    }, []);

    return (
        <div className="p-6">
            {/* Header */}
            <div className="flex justify-between items-center mb-8">
                <h1 className="text-3xl font-bold text-green-800">Gestión de Usuarios</h1>
                <span className="bg-green-100 text-green-800 text-sm px-4 py-2 rounded-full flex items-center">
                    <span className="mr-2">🌿</span>
                    {users.length} usuarios ecológicos
                </span>
                {/* Botón de acción */}
                {!isLoading && !error && (
                    <Link
                        to="/admin/add-user"
                        className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
                    >
                        <span className="mr-2">➕</span>
                        Agregar nuevo usuario
                    </Link>
                )}
            </div>

            <LoadingWrapper isLoading={isLoading} error={error} loadingComponent={<Loading size="large" fullScreen />}>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {users.map((user) => (
                        <Link
                            key={user.id}
                            to={`/admin/clients/${user.id}`}
                            className="bg-white border border-green-100 rounded-lg shadow-sm hover:shadow-md transition-shadow overflow-hidden hover:border-green-300"
                        >
                            <div className="p-6">
                                <div className="flex items-center mb-4">
                                    <div className="bg-green-100 text-green-800 p-3 rounded-full mr-4">
                                        {user.id % 2 === 0 ? '👤' : '🌱'}
                                    </div>
                                    <h2 className="text-lg font-semibold text-green-700">{user.name}</h2>
                                </div>
                                <div className="space-y-2 text-sm text-gray-600">
                                    <p className="flex items-center">
                                        <span className="mr-2">📧</span>
                                        {user.email.toLowerCase()}
                                    </p>
                                    <p className="flex items-center">
                                        <span className="mr-2">🏢</span>
                                        {user.company.name}
                                    </p>
                                    <p className="flex items-center">
                                        <span className="mr-2">🌐</span>
                                        {user.website}
                                    </p>
                                </div>
                            </div>
                            <div className="bg-green-50 px-6 py-3 border-t border-green-100">
                                <span className="text-xs font-medium text-green-600">
                                    Ver detalles →
                                </span>
                            </div>
                        </Link>
                    ))}
                </div>
            </LoadingWrapper>
        </div>
    );
}