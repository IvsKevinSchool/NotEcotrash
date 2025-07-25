import { Outlet } from "react-router-dom";
import { SidebarECO } from "./SidebarECO";

export const LayoutECO = () => {
    return (
        <div className="flex min-h-screen bg-gray-100">
            <SidebarECO />

            <div className="flex-1 ml-64 p-6">
                {/* Aquí podrías incluir un Header si lo necesitas */}
                <main className="bg-white rounded-lg shadow p-6">
                    <Outlet />
                </main>
            </div>
        </div>
    );
};