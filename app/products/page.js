"use client";

import React, { useState, useEffect } from 'react';
import { Plus, Search, Box, Package } from 'lucide-react';
import AddProductModal from '../components/AddProductModal';

const LOW_STOCK_LIMIT = 10;

const stockTone = (cartons) => {
  if (cartons === 0) return { text: 'text-red-400', label: 'Out of stock' };
  if (cartons < LOW_STOCK_LIMIT) return { text: 'text-orange-400', label: 'Low stock' };
  return { text: 'text-amber-300', label: null };
};

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
    <div className="min-h-screen space-y-6 bg-stone-950 p-4 text-stone-300 sm:p-6">
      {/* Header */}
      <div className="flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-center">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight text-stone-50">Products inventory</h1>
          <p className="mt-1 text-sm text-stone-500">{products.length} products in stock list</p>
        </div>
        <button
          onClick={() => setIsModalOpen(true)}
          className="flex w-full items-center justify-center gap-2 rounded-lg bg-amber-400 px-4 py-2 font-semibold text-stone-950 transition-colors hover:bg-amber-300 focus:outline-none focus-visible:ring-2 focus-visible:ring-amber-300 focus-visible:ring-offset-2 focus-visible:ring-offset-stone-950 sm:w-auto"
        >
          <Plus size={20} />
          Add item
        </button>
      </div>

      {/* Search */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-stone-500" size={20} />
        <input
          type="text"
          placeholder="Search products..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full rounded-xl border border-stone-800 bg-stone-900 py-3 pl-10 pr-4 text-stone-100 placeholder:text-stone-500 focus:border-amber-400/60 focus:outline-none focus:ring-2 focus:ring-amber-400/30"
        />
      </div>

      {/* Product grid */}
      {filteredProducts.length === 0 ? (
        <div className="flex flex-col items-center gap-3 rounded-xl border border-dashed border-stone-800 bg-stone-900 p-12 text-center">
          <Box size={48} className="text-stone-700" />
          <p className="font-medium text-stone-400">
            {searchTerm ? 'No products match your search' : 'No products yet'}
          </p>
          <p className="text-sm text-stone-500">
            {searchTerm ? 'Try a different name.' : 'Use Add item to create your first product.'}
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {filteredProducts.map(product => {
            const cartons = parseInt(product.cartons || 0);
            const tone = stockTone(cartons);
            return (
              <div
                key={product.id}
                className="flex flex-col gap-4 rounded-xl border border-stone-800 bg-stone-900 p-5 transition-colors hover:border-stone-700"
              >
                <div className="flex items-start justify-between gap-3">
                  <h3 className="line-clamp-2 text-lg font-semibold text-stone-50">{product.name}</h3>
                  <div className="rounded-lg bg-amber-400/10 p-2 text-amber-400">
                    <Package size={20} />
                  </div>
                </div>

                <div className="flex items-center justify-between rounded-lg border border-stone-800 bg-stone-950/60 p-3">
                  <div className="flex flex-col">
                    <span className="text-xs font-medium text-stone-500">Cartons</span>
                    <span className={`text-xl font-bold tabular-nums ${tone.text}`}>{cartons}</span>
                    {tone.label && <span className={`text-xs ${tone.text}`}>{tone.label}</span>}
                  </div>
                  <div className="h-8 w-px bg-stone-800"></div>
                  <div className="flex flex-col items-end">
                    <span className="text-xs font-medium text-stone-500">Boxes per carton</span>
                    <span className="text-lg font-bold text-stone-200 tabular-nums">{product.boxesPerCarton}</span>
                  </div>
                </div>

                <div className="flex items-center justify-between border-t border-stone-800 pt-3">
                  <div className="flex flex-col">
                    <span className="text-xs font-medium text-stone-500">Buy price</span>
                    <span className="font-semibold text-stone-200 tabular-nums">₹{Number(product.buyPrice || 0).toFixed(2)}</span>
                  </div>
                  <div className="flex flex-col items-end">
                    <span className="text-xs font-medium text-stone-500">Sell price</span>
                    <span className="font-semibold text-emerald-400 tabular-nums">₹{Number(product.sellPrice || 0).toFixed(2)}</span>
                  </div>
                </div>
              </div>
            );
          })}
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