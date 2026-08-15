"use client";

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { 
  LayoutDashboard, 
  Package, 
  ReceiptIndianRupee, 
  Users, 
  Settings,
  X
} from 'lucide-react';

const Sidebar = ({ isOpen, toggleSidebar }) => {
  const pathname = usePathname();

  const menuItems = [
    { name: 'Dashboard', href: '/', icon: <LayoutDashboard size={20} /> },
    { name: 'Products', href: '/products', icon: <Package size={20} /> },
    { name: 'Billing', href: '/billing', icon: <ReceiptIndianRupee size={20} /> },
  ];

  return (
    <>
      {/* Overlay for mobile when sidebar is open */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-black/50 z-40 md:hidden" 
          onClick={toggleSidebar}
        />
      )}

      {/* Sidebar container */}
      <div className={`fixed inset-y-0 left-0 z-50 w-64 bg-slate-900 text-slate-300 flex flex-col border-r border-slate-800 transition-transform duration-300 ease-in-out md:translate-x-0 md:static md:h-screen ${isOpen ? 'translate-x-0' : '-translate-x-full'}`}>
        
        {/* Header */}
        <div className="p-6 flex items-center justify-between border-b border-slate-800">
          <span className="text-emerald-400 font-bold text-xl">Menu</span>
          <button onClick={toggleSidebar} className="md:hidden text-slate-400 hover:text-white">
            <X size={24} />
          </button>
        </div>

        {/* Navigation Links */}
        <nav className="flex-1 mt-4 px-4 space-y-2 overflow-y-auto">
          {menuItems.map((item, index) => {
            const isActive = pathname === item.href;
            return (
              <Link
                href={item.href}
                key={index}
                onClick={() => {
                  if (window.innerWidth < 768) {
                    toggleSidebar();
                  }
                }}
                className={`flex items-center gap-4 px-4 py-3 rounded-lg transition-all cursor-pointer group ${isActive ? 'bg-emerald-600 text-white' : 'hover:bg-slate-800 hover:text-white'}`}
              >
                <span className={`transition-transform ${isActive ? '' : 'group-hover:scale-110'}`}>
                  {item.icon}
                </span>
                <span className="font-medium">{item.name}</span>
              </Link>
            );
          })}
        </nav>

        {/* Footer / Settings */}
        <div className="p-4 border-t border-slate-800">
          <div className="flex items-center gap-4 px-4 py-3 rounded-lg hover:bg-slate-800 cursor-pointer">
            <Settings size={20} />
            <span className="text-sm">Settings</span>
          </div>
        </div>
      </div>
    </>
  );
};

export default Sidebar;