"use client";

import React, { useState, useEffect } from 'react';
import { PackageSearch, IndianRupee, ShoppingCart, BarChart3, AlertTriangle, PackageX, Clock, ArrowRight } from 'lucide-react';
import Link from 'next/link';

const LOW_STOCK_LIMIT = 10;

// One strip of four figures, separated by dividers instead of four separate cards
const StatItem = ({ title, value, icon, iconClass, subtitle }) => (
  <div className="flex flex-col gap-3 p-6">
    <div className="flex items-center gap-3">
      <div className={`flex h-10 w-10 items-center justify-center rounded-lg ${iconClass}`}>
        {icon}
      </div>
      <h3 className="text-sm font-medium text-stone-400">{title}</h3>
    </div>
    <p className="text-3xl font-semibold tracking-tight text-stone-50 tabular-nums">{value}</p>
    <p className="text-xs text-stone-500">{subtitle}</p>
  </div>
);

const StatusBadge = ({ cartons }) => {
  if (cartons === 0) {
    return <span className="rounded-md bg-red-500/10 px-2 py-1 text-xs font-semibold text-red-400 ring-1 ring-inset ring-red-500/20">Out of stock</span>;
  }
  if (cartons < LOW_STOCK_LIMIT) {
    return <span className="rounded-md bg-orange-500/10 px-2 py-1 text-xs font-semibold text-orange-400 ring-1 ring-inset ring-orange-500/20">Low stock</span>;
  }
  return <span className="rounded-md bg-emerald-500/10 px-2 py-1 text-xs font-semibold text-emerald-400 ring-1 ring-inset ring-emerald-500/20">In stock</span>;
};

const Page = () => {
  const [isMounted, setIsMounted] = useState(false);
  const [currentDate, setCurrentDate] = useState("");
  const [stats, setStats] = useState({
    totalProducts: 0,
    totalCartons: 0,
    totalInvestment: 0,
    totalExpectedSales: 0,
    totalExpectedProfit: 0,
    lowStockItems: 0,
    outOfStockItems: 0
  });
  const [recentProducts, setRecentProducts] = useState([]);

  useEffect(() => {
    setIsMounted(true);
    setCurrentDate(new Date().toLocaleDateString('en-IN'));

    const savedProducts = typeof window !== 'undefined' ? localStorage.getItem('stock_management_products') : null;

    if (savedProducts) {
      try {
        const products = JSON.parse(savedProducts);

        let cartons = 0;
        let investment = 0;
        let expectedSales = 0;
        let lowStock = 0;
        let outOfStock = 0;

        products.forEach(p => {
          const currentCartons = parseInt(p.cartons || 0);
          cartons += currentCartons;

          if (currentCartons === 0) outOfStock++;
          else if (currentCartons < LOW_STOCK_LIMIT) lowStock++;

          // buyPrice and sellPrice are per box
          const totalBoxes = currentCartons * parseInt(p.boxesPerCarton || 0);
          investment += totalBoxes * parseFloat(p.buyPrice || 0);
          expectedSales += totalBoxes * parseFloat(p.sellPrice || 0);
        });

        setStats({
          totalProducts: products.length,
          totalCartons: cartons,
          totalInvestment: investment,
          totalExpectedSales: expectedSales,
          totalExpectedProfit: expectedSales - investment,
          lowStockItems: lowStock,
          outOfStockItems: outOfStock
        });

        setRecentProducts(products.slice(0, 5));
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

  // Prevent hydration mismatch by not rendering content until mounted
  if (!isMounted) return null;

  const marginPercent = stats.totalExpectedSales > 0
    ? Math.round((stats.totalExpectedProfit / stats.totalExpectedSales) * 100)
    : 0;
  const costShare = stats.totalExpectedSales > 0
    ? Math.min(100, Math.round((stats.totalInvestment / stats.totalExpectedSales) * 100))
    : 0;

  return (
    <div className="min-h-screen space-y-6 bg-stone-950 p-4 text-stone-300 sm:p-6">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h1 className="text-2xl font-semibold tracking-tight text-stone-50">Stock dashboard</h1>
        <div className="flex items-center gap-2 rounded-lg border border-stone-800 bg-stone-900 px-3 py-1.5 text-sm text-stone-400">
          <Clock size={16} className="text-amber-400" />
          Last updated: {currentDate}
        </div>
      </div>

      {/* Stats strip */}
      <div className="grid grid-cols-1 divide-y divide-stone-800 overflow-hidden rounded-xl border border-stone-800 bg-stone-900 sm:grid-cols-2 sm:divide-y-0 lg:grid-cols-4 lg:divide-x">
        <StatItem
          title="Total products"
          value={stats.totalProducts.toString()}
          icon={<PackageSearch size={20} className="text-emerald-400" />}
          iconClass="bg-emerald-500/10"
          subtitle="Unique items in inventory"
        />
        <StatItem
          title="Total cartons"
          value={stats.totalCartons.toString()}
          icon={<ShoppingCart size={20} className="text-sky-400" />}
          iconClass="bg-sky-500/10"
          subtitle="Available in warehouse"
        />
        <StatItem
          title="Low stock"
          value={stats.lowStockItems.toString()}
          icon={<AlertTriangle size={20} className="text-orange-400" />}
          iconClass="bg-orange-500/10"
          subtitle={`Items below ${LOW_STOCK_LIMIT} cartons`}
        />
        <StatItem
          title="Out of stock"
          value={stats.outOfStockItems.toString()}
          icon={<PackageX size={20} className="text-red-400" />}
          iconClass="bg-red-500/10"
          subtitle="Items with zero stock"
        />
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        {/* Inventory table */}
        <div className="flex flex-col overflow-hidden rounded-xl border border-stone-800 bg-stone-900 lg:col-span-2">
          <div className="flex items-center justify-between border-b border-stone-800 p-5">
            <h2 className="font-semibold text-stone-50">Inventory status</h2>
            <Link href="/products" className="flex items-center gap-1 text-sm font-medium text-amber-400 transition-all hover:gap-2 hover:text-amber-300">
              View all <ArrowRight size={16} />
            </Link>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead className="bg-stone-950/50 text-xs font-medium text-stone-500">
                <tr>
                  <th className="px-6 py-3">Product name</th>
                  <th className="px-6 py-3">Current stock</th>
                  <th className="px-6 py-3">Status</th>
                  <th className="px-6 py-3 text-right">Value (sell)</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-stone-800">
                {recentProducts.length > 0 ? (
                  recentProducts.map((product) => {
                    const cartons = parseInt(product.cartons || 0);
                    const value = cartons * parseInt(product.boxesPerCarton || 0) * parseFloat(product.sellPrice || 0);
                    return (
                      <tr key={product.id} className="transition-colors hover:bg-stone-800/50">
                        <td className="px-6 py-4 font-medium text-stone-100">{product.name}</td>
                        <td className="px-6 py-4 text-stone-400 tabular-nums">{cartons} cartons</td>
                        <td className="px-6 py-4"><StatusBadge cartons={cartons} /></td>
                        <td className="px-6 py-4 text-right font-semibold text-stone-100 tabular-nums">
                          {formatCurrency(value)}
                        </td>
                      </tr>
                    );
                  })
                ) : (
                  <tr>
                    <td colSpan="4" className="px-6 py-12 text-center text-stone-500">
                      No products yet. Add your first item to see it here.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Financial column */}
        <div className="flex flex-col gap-6">
          <div className="flex-1 rounded-xl border border-stone-800 bg-stone-900 p-6">
            <h2 className="mb-5 flex items-center gap-2 font-semibold text-stone-50">
              <IndianRupee size={20} className="text-amber-400" />
              Financial summary
            </h2>

            <div className="space-y-3">
              <div className="flex items-center justify-between rounded-lg bg-stone-950/60 p-3">
                <span className="text-sm text-stone-400">Total investment</span>
                <span className="font-semibold text-stone-100 tabular-nums">{formatCurrency(stats.totalInvestment)}</span>
              </div>
              <div className="flex items-center justify-between rounded-lg bg-stone-950/60 p-3">
                <span className="text-sm text-stone-400">Expected revenue</span>
                <span className="font-semibold text-stone-100 tabular-nums">{formatCurrency(stats.totalExpectedSales)}</span>
              </div>
            </div>

            <div className="mt-5 border-t border-stone-800 pt-5">
              <p className="text-sm text-stone-400">Expected profit</p>
              <p className="mt-1 text-4xl font-bold tracking-tight text-amber-300 tabular-nums">
                {formatCurrency(stats.totalExpectedProfit)}
              </p>

              {/* Cost vs profit share of expected revenue */}
              <div className="mt-4 flex h-2 overflow-hidden rounded-full bg-stone-800">
                <div className="bg-stone-500" style={{ width: `${costShare}%` }} />
                <div className="bg-amber-400" style={{ width: `${Math.max(0, 100 - costShare)}%` }} />
              </div>
              <div className="mt-2 flex justify-between text-xs text-stone-500">
                <span>Cost {costShare}%</span>
                <span>Margin {marginPercent}%</span>
              </div>
            </div>
          </div>

          <div className="relative overflow-hidden rounded-xl border border-stone-800 bg-stone-900 p-6">
            <div className="relative z-10">
              <h3 className="mb-1 text-lg font-semibold text-stone-50">New sale</h3>
              <p className="mb-4 text-sm text-stone-400">Create a bill for a customer order.</p>
              <Link href="/billing" className="inline-flex items-center gap-2 rounded-lg bg-amber-400 px-4 py-2 font-semibold text-stone-950 transition-colors hover:bg-amber-300 focus:outline-none focus-visible:ring-2 focus-visible:ring-amber-300 focus-visible:ring-offset-2 focus-visible:ring-offset-stone-900">
                Create bill <ArrowRight size={16} />
              </Link>
            </div>
            <BarChart3 size={80} className="absolute -bottom-4 -right-4 text-stone-100/5" />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Page;