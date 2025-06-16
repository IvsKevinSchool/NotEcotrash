import React from 'react';
import { NavLink } from 'react-router-dom';

interface NavButtonProps {
    to: string;
    label: string;
    className?: string;
}

const NavButton: React.FC<NavButtonProps> = ({ to, label, className }) => {
    return (
        <NavLink
            to={to}
            className={({ isActive }) =>
                `${className || ''} ${isActive ? 'text-blue-500 font-bold' : 'text-gray-700'}`
            }
        >
            {label}
        </NavLink>
    );
};

export default NavButton;