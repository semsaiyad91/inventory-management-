"use client";

import React from "react";
import { Menu } from "lucide-react";

const Navbar = ({ toggleSidebar }) => {
  return (
    <header className="relative z-40 flex h-16 w-full items-center justify-between border-b border-slate-800 bg-slate-900 px-4">
      <div className="flex items-center gap-4">
        {/* Mobile Button: Pure HTML Label (Bina JS ke 100% kaam karega) */}
        <label
          htmlFor="sidebar-toggle"
          className="flex md:hidden h-11 w-11 items-center justify-center rounded-lg bg-slate-800 text-slate-100 active:bg-emerald-600 cursor-pointer"
        >
          <Menu size={24} />
        </label>

        {/* Desktop Button: Web ke liye */}
        <button
          type="button"
          onClick={toggleSidebar}
          className="hidden md:flex h-11 w-11 items-center justify-center rounded-lg bg-slate-800 text-slate-100 hover:bg-slate-700 cursor-pointer"
        >
          <Menu size={24} />
        </button>

        <span className="text-xl font-bold tracking-tight text-white">
          Stock<span className="text-emerald-400">Management</span>
        </span>
      </div>

      <div className="hidden md:block text-sm font-medium text-slate-400">
        Inventory Dashboard
      </div>
    </header>
  );
};

export default Navbar;