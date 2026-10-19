"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  Package,
  ReceiptIndianRupee,
  Settings,
  X,
} from "lucide-react";

const Sidebar = ({ isOpen, toggleSidebar }) => {
  const pathname = usePathname();

  const menuItems = [
    { name: "Dashboard", href: "/", icon: <LayoutDashboard size={20} /> },
    { name: "Products", href: "/products", icon: <Package size={20} /> },
    { name: "Billing", href: "/billing", icon: <ReceiptIndianRupee size={20} /> },
  ];

  // Mobile par link click hone par checkbox uncheck karne ke liye
  const closeMobileSidebar = () => {
    const checkbox = document.getElementById("sidebar-toggle");
    if (checkbox) checkbox.checked = false;
  };

  return (
    <>
      {/* Hidden Checkbox jo mobile par sidebar control karega */}
      <input type="checkbox" id="sidebar-toggle" className="peer hidden" />

      {/* Mobile Dark Overlay (Touch karne par band ho jayega) */}
      <label
        htmlFor="sidebar-toggle"
        className="fixed inset-0 z-[9998] hidden bg-black/60 peer-checked:block md:!hidden"
      />

      {/* Sidebar Container */}
      <aside
        className={`fixed inset-y-0 left-0 z-[9999] h-screen w-64 -translate-x-full peer-checked:translate-x-0 bg-slate-900 text-slate-300 border-r border-slate-800 transition-all duration-300 ease-in-out md:static md:translate-x-0 ${isOpen ? "md:w-64" : "md:w-0 md:overflow-hidden md:border-none"
          }`}
      >
        <div className="flex h-full w-64 flex-col">
          {/* Header */}
          <div className="flex h-16 items-center justify-between border-b border-slate-800 px-6">
            <span className="text-xl font-bold text-emerald-400">Stock App</span>

            {/* Mobile Close 'X' Button */}
            <label
              htmlFor="sidebar-toggle"
              className="rounded p-1 text-slate-400 hover:text-white md:hidden cursor-pointer"
            >
              <X size={24} />
            </label>
          </div>

          {/* Navigation Links */}
          <nav className="mt-4 flex-1 space-y-2 overflow-y-auto px-4">
            {menuItems.map((item, index) => {
              const isActive = pathname === item.href;
              return (
                <Link
                  key={index}
                  href={item.href}
                  onClick={closeMobileSidebar}
                  className={`flex items-center gap-4 rounded-lg px-4 py-3 transition-all ${isActive
                      ? "bg-emerald-600 text-white"
                      : "hover:bg-slate-800 hover:text-white"
                    }`}
                >
                  <span className="shrink-0">{item.icon}</span>
                  <span className="font-medium whitespace-nowrap">{item.name}</span>
                </Link>
              );
            })}
          </nav>

          {/* Footer */}
          <div className="border-t border-slate-800 p-4">
            <div className="flex cursor-pointer items-center gap-4 rounded-lg px-4 py-3 hover:bg-slate-800">
              <Settings size={20} className="shrink-0" />
              <span className="text-sm whitespace-nowrap">Settings</span>
            </div>
          </div>
        </div>
      </aside>
    </>
  );
};

export default Sidebar;