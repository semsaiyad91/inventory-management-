"use client";

import React, { useState, useEffect } from 'react';
import { Plus, Search, Box, Package } from 'lucide-react';
import AddProductModal from '../components/AddProductModal';

export default function ProductsPage() {
  const [products, setProducts] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');

  // Load from localStorage on mount
  useEffect(() => {
    const savedProducts = localStorage.getItem('stock_management_products');
    if (savedProducts) {
      try {
        setProducts(JSON.parse(savedProducts));
      } catch (e) {
        console.error("Error parsing products", e);
      }
    } else {
      // Dummy data if empty
      const dummy = [
        { id: 1, name: 'Parle-G 100g', cartons: 50, boxesPerCarton: 120, buyPrice: 4.5, sellPrice: 5 },
        { id: 2, name: 'Britannia 50-50', cartons: 20, boxesPerCarton: 100, buyPrice: 9, sellPrice: 10 }
      ];
      setProducts(dummy);
      localStorage.setItem('stock_management_products', JSON.stringify(dummy));
    }
  }, []);

  const handleAddProduct = (newProduct) => {
    const updatedProducts = [newProduct, ...products];
    setProducts(updatedProducts);
    localStorage.setItem('stock_management_products', JSON.stringify(updatedProducts));
  };

  const filteredProducts = products.filter(p => 
    p.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <h1 className="text-2xl font-bold text-slate-800">Products Inventory</h1>
        <button 
          onClick={() => setIsModalOpen(true)}
          className="flex items-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white px-4 py-2 rounded-lg font-medium transition-colors shadow-sm w-full sm:w-auto justify-center"
        >
          <Plus size={20} />
          Add Item
        </button>
      </div>

      {/* Controls */}
      <div className="bg-white p-4 rounded-xl shadow-sm border border-slate-100 flex flex-col sm:flex-row items-center gap-4">
        <div className="relative w-full">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
          <input 
            type="text" 
            placeholder="Search products..." 
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-3 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
          />
        </div>
      </div>

      {/* Product Cards Grid */}
      {filteredProducts.length === 0 ? (
        <div className="bg-white p-12 rounded-xl border border-slate-100 text-center flex flex-col items-center gap-3">
          <Box size={48} className="text-slate-300" />
          <p className="text-slate-500 font-medium">No products found</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {filteredProducts.map(product => (
            <div key={product.id} className="bg-white rounded-xl shadow-sm border border-slate-200 p-5 hover:shadow-md transition-shadow flex flex-col gap-4">
              <div className="flex justify-between items-start">
                <h3 className="font-bold text-lg text-slate-800 line-clamp-2">{product.name}</h3>
                <div className="bg-emerald-100 p-2 rounded-lg text-emerald-600">
                  <Package size={20} />
                </div>
              </div>
              
              <div className="bg-slate-50 p-3 rounded-lg flex items-center justify-between border border-slate-100">
                <div className="flex flex-col">
                  <span className="text-xs text-slate-500 font-medium uppercase tracking-wider">Cartons</span>
                  <span className="text-xl font-bold text-emerald-700">{product.cartons}</span>
                </div>
                <div className="h-8 w-px bg-slate-200"></div>
                <div className="flex flex-col items-end">
                  <span className="text-xs text-slate-500 font-medium uppercase tracking-wider">Boxes/Carton</span>
                  <span className="text-lg font-bold text-slate-700">{product.boxesPerCarton}</span>
                </div>
              </div>

              <div className="flex justify-between items-center pt-2 border-t border-slate-100">
                <div className="flex flex-col">
                  <span className="text-xs text-slate-400 font-medium">Buy Price</span>
                  <span className="font-semibold text-slate-700">₹{product.buyPrice.toFixed(2)}</span>
                </div>
                <div className="flex flex-col items-end">
                  <span className="text-xs text-slate-400 font-medium">Sell Price</span>
                  <span className="font-semibold text-emerald-600">₹{product.sellPrice.toFixed(2)}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Modal */}
      <AddProductModal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
        onAddProduct={handleAddProduct}
      />
    </div>
  );
}
