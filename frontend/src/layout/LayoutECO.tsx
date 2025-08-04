import { Outlet } from "react-router-dom";
import { SidebarECO } from "./SidebarECO";
import ProtectedRoute from "../components/ProtectedRoute";
import Header from "../components/Header";

export const LayoutECO = () => {
    return (
        <ProtectedRoute>
            <div className="flex min-h-screen bg-gray-100">
                <SidebarECO />

                <div className="flex-1 ml-64">
                    <Header />
                    <div className="px-6 pb-6">
                        <main className="bg-white rounded-lg shadow p-6">
                            <Outlet />
                        </main>
                    </div>
                </div>
            </div>
        </ProtectedRoute>
    );
};