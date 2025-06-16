import React, { useState } from "react";
import NavButton from "../../components/NavButton";

const AdminIndex = () => {

    return (
        <div>
            <h1>Admin Dashboard</h1>
            <NavButton to="/admin/add-user" label="+ Agregar un nuevo usuario" />
        </div>
    );
}

export default AdminIndex;