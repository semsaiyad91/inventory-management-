"use client";

import React from "react";
import { Menu } from "lucide-react";

const Navbar = ({ toggleSidebar }) => {
  return (
    <nav className="bg-emerald-800 text-white shadow-md w-full">
      <div className="px-4 md:px-6 py-4 flex items-center justify-between">
        
        <div className="flex items-center gap-4 relative z-50">
          {/* Hamburger Menu for Mobile */}
          <div 
            className="md:hidden p-2 bg-emerald-700 hover:bg-emerald-600 rounded cursor-pointer"
            onClick={() => toggleSidebar()}
            onTouchEnd={(e) => {
              e.preventDefault();
              toggleSidebar();
            }}
            role="button"
          >
            <Menu size={24} className="pointer-events-none" />
          </div>

          {/* Brand Name / Logo */}
          <div className="text-xl md:text-2xl font-bold tracking-tight">
            Stock<span className="text-emerald-300">Management</span>
          </div>
        </div>

        {/* Info */}
        <div className="hidden md:block text-sm font-medium opacity-80">
          Inventory Dashboard
        </div>
      </div>
    </nav>
  );
};

export default Navbar;