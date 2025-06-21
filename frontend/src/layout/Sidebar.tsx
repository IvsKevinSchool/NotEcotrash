import React, { useState } from "react";
import {
  DashboardIcon,
  ECommerceIcon,
  KanbanIcon,
  InboxIcon,
  UsersIcon,
  ProductsIcon,
  LogoutIcon,
} from "../assets/icons";

interface MenuItem {
  label: string;
  href?: string;
  icon?: React.ReactNode;
  badge?: React.ReactNode;
  children?: MenuItem[];
  isDropdown?: boolean;
}

const Sidebar = () => {
  const [isDropdownOpen, setIsDropdownOpen] = useState<boolean>(false);

  const handleDropdownToggle = (): void => {
    setIsDropdownOpen((prev) => !prev);
  };

  const handleLogout = (): void => {
    // Agregar aquí la lógica de logout
    console.log("Logout");
  };

  const menuItems: MenuItem[] = [
    {
      label: "Dashboard",
      href: "#",
      icon: <DashboardIcon />,
    },
    {
      label: "E-commerce",
      isDropdown: true,
      icon: <ECommerceIcon />,
      children: [
        { label: "Products", href: "#" },
        { label: "Billing", href: "#" },
        { label: "Invoice", href: "#" },
      ],
    },
    {
      label: "Kanban",
      href: "#",
      icon: <KanbanIcon />,
      badge: (
        <span className="inline-flex items-center justify-center px-2 ms-3 text-sm font-medium text-gray-800 bg-gray-100 rounded-full dark:bg-gray-700 dark:text-gray-300">
          Pro
        </span>
      ),
    },
    {
      label: "Inbox",
      href: "#",
      icon: <InboxIcon />,
      badge: (
        <span className="inline-flex items-center justify-center w-3 h-3 p-3 ms-3 text-sm font-medium text-blue-800 bg-blue-100 rounded-full dark:bg-blue-900 dark:text-blue-300">
          3
        </span>
      ),
    },
    {
      label: "Users",
      href: "#",
      icon: <UsersIcon />,
    },
    {
      label: "Products",
      href: "#",
      icon: <ProductsIcon />,
    },
  ];

  return (
    <aside
      id="sidebar-multi-level-sidebar"
      className="flex flex-col z-40 w-[20%] h-screen transition-transform -translate-x-full sm:translate-x-0"
      aria-label="Sidebar"
    >
      <div className="flex flex-col flex-1 h-full px-3 py-4 overflow-y-auto bg-gray-50 dark:bg-gray-800">
        <ul className="space-y-2 font-medium">
          {menuItems.map((item, index) => (
            <li key={index}>
              {item.isDropdown && item.children ? (
                <>
                  <button
                    type="button"
                    onClick={handleDropdownToggle}
                    className="flex items-center w-full p-2 text-base text-gray-900 transition duration-75 rounded-lg group hover:bg-gray-100 dark:text-white dark:hover:bg-gray-700"
                    aria-controls="dropdown-example"
                    aria-expanded={isDropdownOpen}
                  >
                    {item.icon}
                    <span className="flex-1 ms-3 text-left rtl:text-right whitespace-nowrap">
                      {item.label}
                    </span>
                    <svg
                      className="w-3 h-3 transition-transform duration-200 transform dark:text-white"
                      style={{ transform: isDropdownOpen ? "rotate(180deg)" : "rotate(0deg)" }}
                      aria-hidden="true"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 10 6"
                    >
                      <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="m1 1 4 4 4-4" />
                    </svg>
                  </button>
                  <ul id="dropdown-example" className={`py-2 space-y-2 ${isDropdownOpen ? "block" : "hidden"}`}>
                    {item.children.map((child, childIndex) => (
                      <li key={childIndex}>
                        <a
                          href={child.href}
                          className="flex items-center w-full p-2 text-gray-900 transition duration-75 rounded-lg pl-11 group hover:bg-gray-100 dark:text-white dark:hover:bg-gray-700"
                        >
                          {child.label}
                        </a>
                      </li>
                    ))}
                  </ul>
                </>
              ) : (
                <a
                  href={item.href}
                  className="flex items-center p-2 text-gray-900 rounded-lg dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700 group"
                >
                  {item.icon}
                  <span className="flex-1 ms-3 whitespace-nowrap">{item.label}</span>
                  {item.badge && item.badge}
                </a>
              )}
            </li>
          ))}
          <li className="mt-4">
            <button
              onClick={handleLogout}
              className="w-full flex items-center p-2 text-gray-900 rounded-lg dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700 group"
            >
              <LogoutIcon />
              <span className="flex-1 ms-3 whitespace-nowrap">Logout</span>
            </button>
          </li>
        </ul>
      </div>
    </aside>
  );
};

export default Sidebar;