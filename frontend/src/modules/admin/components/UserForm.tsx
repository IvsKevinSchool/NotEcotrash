import React from "react";

const UserForm = () => {
    return (
        <form>
            <div className="mb-4">
                <label htmlFor="username" className="block text-gray-700">Username</label>
                <input type="text" id="username" name="username" className="mt-1 block w-full p-2 border border-gray-300 rounded" required />
            </div>
            <div className="mb-4">
                <label htmlFor="email" className="block text-gray-700">Email</label>
                <input type="email" id="email" name="email" className="mt-1 block w-full p-2 border border-gray-300 rounded" required />
            </div>
            <div className="mb-4">
                <label htmlFor="password" className="block text-gray-700">Password</label>
                <input type="password" id="password" name="password" className="mt-1 block w-full p-2 border border-gray-300 rounded" required />
            </div>
            <button type="submit" className="bg-blue-500 text-white px-4 py-2 rounded cursor-pointer">Add User</button>
        </form>
    );
}

export default UserForm;