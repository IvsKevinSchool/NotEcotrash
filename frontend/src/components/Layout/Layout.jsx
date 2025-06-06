import Sidebar from "./Sidebar";

const Layout = ({ children }) => {
    return (
        <div className="flex min-h-screen bg-gray-100">
            <Sidebar />

            <div className="flex-1 ml-64 p-6">
                {/* Aquí podrías incluir un Header si lo necesitas */}
                <main className="bg-white rounded-lg shadow p-6">
                    {children}
                </main>
            </div>
        </div>
    );
};

export default Layout;