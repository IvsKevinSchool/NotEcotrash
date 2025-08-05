import { Outlet } from "react-router-dom";
import { SidebarECO } from "./SidebarECO";
import ProtectedRoute from "../components/ProtectedRoute";

export const LayoutECO = () => {
    return (
        <ProtectedRoute>
            <div className="flex min-h-screen bg-gray-100">
                <SidebarECO />

                <div className="flex-1 p-6">
                    {/* Aquí podrías incluir un Header si lo necesitas */}
                    <main className="bg-white rounded-lg shadow p-6">
                        <Outlet />
                    </main>
                </div>
            </div>
        </ProtectedRoute>
    );
};