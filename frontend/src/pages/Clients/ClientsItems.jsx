import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import LoadingWrapper from '../../components/Common/LoadingWrapper';
import Loading from '../../components/Common/Loading';

export default function ClientsItems() {
  const { id } = useParams();
  const [todos, setTodos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [user, setUser] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);

        // Fetch user data
        const userResponse = await fetch(`https://jsonplaceholder.typicode.com/users/${id}`);
        if (!userResponse.ok) throw new Error('Failed to fetch user');
        const userData = await userResponse.json();
        setUser(userData);

        // Fetch todos
        const todosResponse = await fetch(`https://jsonplaceholder.typicode.com/users/${id}/todos`);
        if (!todosResponse.ok) throw new Error('Failed to fetch todos');
        const todosData = await todosResponse.json();
        setTodos(todosData);

      } catch (error) {
        console.log('Error fetching data: ', error);
        setError(error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [id]);

  return (
    <div className="p-6">
      {/* Header (siempre visible) */}
      <div className="flex justify-between items-start mb-8">
        <div>
          <Link
            to="/admin/clients"
            className="inline-flex items-center text-sm text-green-600 hover:text-green-800 mb-4"
          >
            <span className="mr-1">←</span> Volver a usuarios
          </Link>
          <h1 className="text-3xl font-bold text-green-800">
            {user ? `${user.name}'s Tareas` : 'Tareas del Usuario'}
          </h1>
          {user && (
            <p className="text-green-600 mt-2">
              <span className="font-medium">Email:</span> {user.email.toLowerCase()}
            </p>
          )}
        </div>
        {!loading && !error && (
          <div className="bg-green-100 text-green-800 px-4 py-2 rounded-full text-sm">
            {todos.length} tareas totales
          </div>
        )}
      </div>

      {/* Usamos LoadingWrapper para manejar los estados */}
      <LoadingWrapper
        isLoading={loading}
        error={error}
        loadingComponent={<Loading size="large" fullScreen />}
      >
        {/* Contenido principal cuando no hay loading ni error */}
        <>
          {/* Estadísticas */}
          {todos.length > 0 && (
            <div className="my-8 bg-white p-4 rounded-lg border border-green-100">
              <h3 className="text-lg font-medium text-green-700 mb-3">Resumen</h3>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="bg-green-50 p-3 rounded-lg">
                  <p className="text-sm text-green-600">Total tareas</p>
                  <p className="text-2xl font-bold text-green-800">{todos.length}</p>
                </div>
                <div className="bg-green-50 p-3 rounded-lg">
                  <p className="text-sm text-green-600">Completadas</p>
                  <p className="text-2xl font-bold text-green-800">
                    {todos.filter(t => t.completed).length}
                  </p>
                </div>
                <div className="bg-yellow-50 p-3 rounded-lg">
                  <p className="text-sm text-yellow-600">Pendientes</p>
                  <p className="text-2xl font-bold text-yellow-800">
                    {todos.filter(t => !t.completed).length}
                  </p>
                </div>
                <div className="bg-blue-50 p-3 rounded-lg">
                  <p className="text-sm text-blue-600">Porcentaje</p>
                  <p className="text-2xl font-bold text-blue-800">
                    {/* {Math.round((todos.filter(t => t.completed).length / todos.length * 100)}% */}
                    {Math.round((todos.filter(t => t.completed).length / todos.length * 100))}%
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Lista de tareas */}
          <div className="space-y-4">
            {todos.length > 0 ? (
              todos.map((todo) => (
                <div
                  key={todo.id}
                  className={`border-l-4 ${todo.completed ? 'border-green-500 bg-green-50' : 'border-yellow-500 bg-yellow-50'} p-5 rounded-lg shadow-sm hover:shadow-md transition-shadow`}
                >
                  <div className="flex items-start">
                    <span className={`mt-1 mr-4 ${todo.completed ? 'text-green-500' : 'text-yellow-500'}`}>
                      {todo.completed ? '✓' : '◌'}
                    </span>
                    <div className="flex-1">
                      <h3 className={`font-medium ${todo.completed ? 'text-green-800 line-through' : 'text-gray-800'}`}>
                        {todo.title}
                      </h3>
                      <div className="flex items-center mt-2">
                        <span className={`text-xs px-2 py-1 rounded-full ${todo.completed ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'}`}>
                          {todo.completed ? 'Completada' : 'Pendiente'}
                        </span>
                        <span className="text-xs text-gray-500 ml-2">
                          ID: {todo.id}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div className="text-center py-10 bg-gray-50 rounded-lg">
                <p className="text-gray-500">No se encontraron tareas para este usuario</p>
              </div>
            )}
          </div>
        </>
      </LoadingWrapper>
    </div>
  );
}