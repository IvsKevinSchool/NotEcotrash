import Sidebar from './Sidebar';
import { Outlet } from 'react-router-dom';

const Layout = () => {
  return (
    <div className="flex w-full h-screen">
      {/* Sidebar con estado de colapso */}
      <Sidebar />

      <div className="flex-1 flex flex-col w-[80%] bg-gray-300">
        {/* Header con botón para colapsar el sidebar */}
        <main className="flex-1 p-4 overflow-auto">
          <Outlet /> {/* Aquí se renderizan las páginas */}
        </main>
      </div>
    </div>
  );
};

export default Layout;
