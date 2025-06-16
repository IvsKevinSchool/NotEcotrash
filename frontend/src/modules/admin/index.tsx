import React, { useState } from "react";

const AdminIndex = () => {
    const [message, setMessage] = useState("Hello from Admin Index");

    return (
        <div>
            <h1>Admin Dashboard</h1>
            <p>{message}</p>
            <button onClick={() => setMessage("You clicked the button!")}>
                Click Me
            </button>
        </div>
    );
}

export default AdminIndex;