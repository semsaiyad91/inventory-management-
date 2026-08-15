"use client";

import React, { useState, useEffect } from 'react';
import { PackageSearch, TrendingUp, IndianRupee, ShoppingCart, BarChart3 } from 'lucide-react';

const DashboardCard = ({ title, value, icon, colorClass, subtitle }) => (
  <div className="bg-white rounded-xl p-6 shadow-sm border border-slate-100 flex flex-col gap-2 hover:shadow-md transition-shadow">
    <div className="flex items-center gap-4">
      <div className={`p-4 rounded-lg ${colorClass}`}>
        {icon}
      </div>
      <div>
        <h3 className="text-slate-500 text-sm font-medium">{title}</h3>
        <p className="text-2xl font-bold text-slate-800">{value}</p>
      </div>
    </div>
    {subtitle && <p className="text-xs text-slate-400 mt-2">{subtitle}</p>}
  </div>
);

const Page = () => {
  const [stats, setStats] = useState({
    totalProducts: 0,
    totalCartons: 0,
    totalInvestment: 0,
    totalExpectedSales: 0,
    totalExpectedProfit: 0
  });

  useEffect(() => {
    // Calculate stats from local storage data
    const savedProducts = localStorage.getItem('stock_management_products');
    if (savedProducts) {
      try {
        const products = JSON.parse(savedProducts);
        
        let cartons = 0;
        let investment = 0;
        let expectedSales = 0;

        products.forEach(p => {
          cartons += parseInt(p.cartons || 0);
          
          // Assuming buyPrice and sellPrice are per box
          const totalBoxes = parseInt(p.cartons || 0) * parseInt(p.boxesPerCarton || 0);
          investment += totalBoxes * parseFloat(p.buyPrice || 0);
          expectedSales += totalBoxes * parseFloat(p.sellPrice || 0);
        });

        setStats({
          totalProducts: products.length,
          totalCartons: cartons,
          totalInvestment: investment,
          totalExpectedSales: expectedSales,
          totalExpectedProfit: expectedSales - investment
        });
      } catch (e) {
        console.error("Error calculating stats", e);
      }
    }
  }, []);

  const formatCurrency = (value) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0
    }).format(value);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-slate-800">Stock Dashboard</h1>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <DashboardCard 
          title="Total Products" 
          value={stats.totalProducts.toString()} 
          icon={<PackageSearch size={24} className="text-emerald-600" />} 
          colorClass="bg-emerald-100"
          subtitle="Unique items in inventory"
        />
        <DashboardCard 
          title="Total Cartons" 
          value={stats.totalCartons.toString()} 
          icon={<ShoppingCart size={24} className="text-blue-600" />} 
          colorClass="bg-blue-100"
          subtitle="Available in warehouse"
        />
        <DashboardCard 
          title="Total Investment" 
          value={formatCurrency(stats.totalInvestment)} 
          icon={<IndianRupee size={24} className="text-orange-600" />} 
          colorClass="bg-orange-100"
          subtitle="Based on Buy Price"
        />
        <DashboardCard 
          title="Expected Sales" 
          value={formatCurrency(stats.totalExpectedSales)} 
          icon={<TrendingUp size={24} className="text-purple-600" />} 
          colorClass="bg-purple-100"
          subtitle="Based on Sell Price"
        />
      </div>

      {/* Main Profit Highlight */}
      <div className="bg-gradient-to-r from-emerald-600 to-teal-600 rounded-xl shadow-md p-8 mt-8 text-white flex flex-col md:flex-row items-center justify-between gap-6 relative overflow-hidden">
        <div className="relative z-10">
          <h2 className="text-emerald-100 text-lg font-medium mb-2">Total Expected Profit</h2>
          <div className="text-4xl md:text-5xl font-bold flex items-baseline gap-2">
            {formatCurrency(stats.totalExpectedProfit)}
          </div>
          <p className="text-emerald-50 mt-4 text-sm md:text-base max-w-md">
            Yeh profit tab realize hoga jab aapka saara current stock sell ho jayega. (Expected Sales - Total Investment)
          </p>
        </div>
        <div className="relative z-10 bg-white/10 p-6 rounded-full backdrop-blur-sm border border-white/20 hidden md:block">
          <BarChart3 size={64} className="text-white" />
        </div>
        
        {/* Decorative background shapes */}
        <div className="absolute -top-24 -right-24 w-64 h-64 bg-white/5 rounded-full blur-3xl"></div>
        <div className="absolute -bottom-24 -left-24 w-64 h-64 bg-black/10 rounded-full blur-3xl"></div>
      </div>
    </div>
  );
};

export default Page;