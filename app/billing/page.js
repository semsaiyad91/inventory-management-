"use client";

import React, { useState, useEffect } from 'react';
import { Plus, Trash2, Receipt, Printer, ArrowLeft, ShoppingCart } from 'lucide-react';

const inputClass =
  "w-full rounded-xl border border-stone-700 bg-stone-950/60 px-4 py-3 font-medium text-stone-100 placeholder:text-stone-500 focus:border-amber-400/60 focus:outline-none focus:ring-2 focus:ring-amber-400/30";

export default function BillingPage() {
  const [products, setProducts] = useState([]);
  const [cart, setCart] = useState([]);
  const [customerName, setCustomerName] = useState('');

  // Form States
  const [selectedProductId, setSelectedProductId] = useState('');
  const [sellCartons, setSellCartons] = useState('');

  // Bill Receipt State
  const [generatedBill, setGeneratedBill] = useState(null);

  useEffect(() => {
    const savedProducts = localStorage.getItem('stock_management_products');
    if (savedProducts) {
      try {
        setProducts(JSON.parse(savedProducts));
      } catch (e) {
        console.error("Error parsing products", e);
      }
    }
  }, []);

  const handleAddToCart = () => {
    if (!selectedProductId || !sellCartons || parseInt(sellCartons) <= 0) {
      alert("Please select a valid product and quantity.");
      return;
    }

    const product = products.find(p => p.id.toString() === selectedProductId);
    if (!product) return;

    const qty = parseInt(sellCartons);

    // Check stock
    if (qty > product.cartons) {
      alert(`Not enough stock! Only ${product.cartons} cartons available.`);
      return;
    }

    // Check if already in cart
    const existingIndex = cart.findIndex(item => item.product.id === product.id);

    if (existingIndex >= 0) {
      const newTotalQty = cart[existingIndex].qty + qty;
      if (newTotalQty > product.cartons) {
        alert(`Not enough stock! Only ${product.cartons} cartons available.`);
        return;
      }
      const newCart = [...cart];
      newCart[existingIndex] = {
        ...newCart[existingIndex],
        qty: newTotalQty,
        amount: newTotalQty * product.boxesPerCarton * product.sellPrice
      };
      setCart(newCart);
    } else {
      setCart([...cart, {
        product: product,
        qty: qty,
        ratePerCarton: product.boxesPerCarton * product.sellPrice,
        amount: qty * product.boxesPerCarton * product.sellPrice
      }]);
    }

    // Reset fields
    setSelectedProductId('');
    setSellCartons('');
  };

  const handleRemoveFromCart = (index) => {
    const newCart = [...cart];
    newCart.splice(index, 1);
    setCart(newCart);
  };

  const handleGenerateBill = () => {
    if (cart.length === 0) {
      alert("Cart is empty!");
      return;
    }
    if (!customerName.trim()) {
      alert("Please enter Customer Name.");
      return;
    }

    // Deduct from inventory
    const updatedProducts = products.map(p => {
      const cartItem = cart.find(c => c.product.id === p.id);
      if (cartItem) {
        return { ...p, cartons: p.cartons - cartItem.qty };
      }
      return p;
    });

    setProducts(updatedProducts);
    localStorage.setItem('stock_management_products', JSON.stringify(updatedProducts));

    // Calculate total
    const total = cart.reduce((sum, item) => sum + item.amount, 0);

    // Create Bill Object
    const bill = {
      id: `INV-${Date.now()}`,
      date: new Date().toLocaleString('en-IN'),
      customerName,
      items: [...cart],
      grandTotal: total
    };

    // Save Bill to History
    let savedBills = [];
    try {
      savedBills = JSON.parse(localStorage.getItem('stock_management_bills') || '[]');
    } catch (e) {
      console.error("Error parsing bills", e);
    }
    localStorage.setItem('stock_management_bills', JSON.stringify([bill, ...savedBills]));

    setGeneratedBill(bill);
    setCart([]);
    setCustomerName('');
  };

  const resetBilling = () => {
    setGeneratedBill(null);
  };

  const handlePrint = () => {
    window.print();
  };

  const formatCurrency = (value) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 2
    }).format(value);
  };

  const grandTotal = cart.reduce((sum, item) => sum + item.amount, 0);

  // Print stays black on white, whatever the screen theme is
  const printStyles = (
    <style dangerouslySetInnerHTML={{
      __html: `
      @media print {
        body * {
          visibility: hidden;
        }
        .print-area, .print-area * {
          visibility: visible;
          color: #000 !important;
          background: transparent !important;
          border-color: #999 !important;
          box-shadow: none !important;
        }
        .print-area {
          position: absolute;
          left: 0;
          top: 0;
          width: 100%;
        }
        .print\\:hidden {
          display: none !important;
        }
      }
    `}} />
  );

  // === RENDER BILL RECEIPT VIEW ===
  if (generatedBill) {
    return (
      <div className="min-h-screen bg-stone-950 p-4 text-stone-300 sm:p-6">
        <div className="mx-auto max-w-2xl rounded-xl border border-stone-800 bg-stone-900 p-4 md:p-8">
          <div className="mb-8 flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-center print:hidden">
            <button
              onClick={resetBilling}
              className="flex items-center gap-2 font-medium text-stone-400 transition-colors hover:text-stone-100"
            >
              <ArrowLeft size={20} /> New bill
            </button>
            <button
              onClick={handlePrint}
              className="flex w-full items-center justify-center gap-2 rounded-lg bg-amber-400 px-4 py-3 font-semibold text-stone-950 transition-colors hover:bg-amber-300 focus:outline-none focus-visible:ring-2 focus-visible:ring-amber-300 focus-visible:ring-offset-2 focus-visible:ring-offset-stone-900 sm:w-auto"
            >
              <Printer size={20} /> Print receipt
            </button>
          </div>

          {/* Printable Area */}
          <div className="print-area">
            <div className="mb-8 border-b border-stone-800 pb-6 text-center">
              <h1 className="text-3xl font-bold tracking-tight text-stone-50">
                Stock<span className="text-amber-400">Management</span>
              </h1>
              <p className="mt-1 text-sm font-medium text-stone-500">Wholesale invoice</p>
            </div>

            <div className="mb-8 flex flex-col justify-between gap-4 rounded-xl border border-stone-800 bg-stone-950/60 p-4 text-sm sm:flex-row">
              <div>
                <p className="mb-1 text-xs font-medium text-stone-500">Billed to</p>
                <p className="text-xl font-semibold text-stone-50">{generatedBill.customerName}</p>
              </div>
              <div className="sm:text-right">
                <p className="mb-1 text-sm text-stone-500">Invoice no: <span className="font-semibold text-stone-100">{generatedBill.id}</span></p>
                <p className="text-sm text-stone-500">Date: <span className="font-semibold text-stone-100">{generatedBill.date}</span></p>
              </div>
            </div>

            {/* Items */}
            <div className="mb-8 overflow-hidden rounded-xl border border-stone-800">
              <div className="border-b border-stone-800 bg-stone-950/50 p-3">
                <span className="text-sm font-medium text-stone-400">Items summary</span>
              </div>

              <div className="flex flex-col divide-y divide-stone-800">
                {generatedBill.items.map((item, idx) => (
                  <div key={idx} className="flex flex-col gap-3 p-4">
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <p className="text-lg font-semibold text-stone-50">{item.product.name}</p>
                        <p className="mt-1 inline-block rounded bg-stone-800 px-2 py-1 text-xs font-medium text-stone-400">{item.product.boxesPerCarton} boxes / carton</p>
                      </div>
                      <p className="text-lg font-semibold text-amber-300 tabular-nums">{formatCurrency(item.amount)}</p>
                    </div>

                    <div className="flex items-center justify-between rounded-lg border border-stone-800 bg-stone-950/60 p-3 text-sm">
                      <div className="flex flex-col">
                        <span className="text-xs font-medium text-stone-500">Qty (cartons)</span>
                        <span className="font-semibold text-stone-100 tabular-nums">{item.qty}</span>
                      </div>
                      <div className="h-8 w-px bg-stone-800"></div>
                      <div className="flex flex-col items-end">
                        <span className="text-xs font-medium text-stone-500">Rate / carton</span>
                        <span className="font-semibold text-stone-100 tabular-nums">{formatCurrency(item.ratePerCarton)}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="flex justify-end">
              <div className="w-full rounded-xl border border-amber-400/40 bg-amber-400/5 p-4 sm:w-1/2">
                <div className="flex items-center justify-between gap-3">
                  <span className="text-lg font-semibold text-stone-100">Grand total</span>
                  <span className="text-2xl font-bold text-amber-300 tabular-nums">{formatCurrency(generatedBill.grandTotal)}</span>
                </div>
              </div>
            </div>

            <div className="mt-12 text-center text-sm text-stone-500">
              <p>Thank you for your business!</p>
            </div>
          </div>
        </div>
        {printStyles}
      </div>
    );
  }

  // === RENDER BILLING INTERFACE ===
  return (
    <div className="min-h-screen space-y-6 bg-stone-950 p-4 text-stone-300 sm:p-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold tracking-tight text-stone-50">Billing and sales</h1>
      </div>

      <div className="grid grid-cols-1 gap-6 xl:grid-cols-3">

        {/* Left: add items */}
        <div className="h-fit space-y-5 rounded-xl border border-stone-800 bg-stone-900 p-4 md:p-6 xl:col-span-1">
          <h2 className="border-b border-stone-800 pb-3 text-lg font-semibold text-stone-50">Add items</h2>

          <div>
            <label className="mb-2 block text-sm font-medium text-stone-400">Select product</label>
            <select
              value={selectedProductId}
              onChange={(e) => setSelectedProductId(e.target.value)}
              className={inputClass}
            >
              <option value="">Select a product</option>
              {products.map(p => (
                <option key={p.id} value={p.id} disabled={p.cartons <= 0}>
                  {p.name} ({p.cartons} cartons left)
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="mb-2 block text-sm font-medium text-stone-400">Quantity (cartons)</label>
            <input
              type="number"
              value={sellCartons}
              onChange={(e) => setSellCartons(e.target.value)}
              placeholder="Enter quantity"
              min="1"
              className={inputClass}
            />
          </div>

          <button
            onClick={handleAddToCart}
            className="flex w-full items-center justify-center gap-2 rounded-xl bg-amber-400 py-3 text-lg font-semibold text-stone-950 transition-colors hover:bg-amber-300 focus:outline-none focus-visible:ring-2 focus-visible:ring-amber-300 focus-visible:ring-offset-2 focus-visible:ring-offset-stone-900 md:py-4"
          >
            <Plus size={24} /> Add to bill
          </button>
        </div>

        {/* Right: current invoice */}
        <div className="flex h-full min-h-[500px] flex-col rounded-xl border border-stone-800 bg-stone-900 xl:col-span-2">
          <div className="flex flex-col items-start justify-between gap-4 rounded-t-xl border-b border-stone-800 bg-stone-950/50 p-4 sm:flex-row sm:items-center md:p-6">
            <h2 className="flex items-center gap-2 text-lg font-semibold text-stone-50">
              <Receipt size={24} className="text-amber-400" /> Current invoice
            </h2>
            <div className="w-full sm:w-72">
              <input
                type="text"
                placeholder="Customer name"
                value={customerName}
                onChange={(e) => setCustomerName(e.target.value)}
                className={inputClass}
              />
            </div>
          </div>

          <div className="flex-1 p-4 md:p-6">
            {cart.length === 0 ? (
              <div className="flex h-full min-h-[300px] flex-col items-center justify-center rounded-xl border border-dashed border-stone-800 p-6 text-center">
                <ShoppingCart size={56} className="mb-4 text-stone-700" />
                <p className="text-lg font-medium text-stone-400">Your bill is empty</p>
                <p className="mt-1 text-sm text-stone-500">Pick a product on the left and add it to the bill.</p>
              </div>
            ) : (
              <div className="flex flex-col gap-4">
                {cart.map((item, idx) => (
                  <div key={idx} className="relative flex flex-col gap-3 rounded-xl border border-stone-800 bg-stone-950/40 p-4">
                    <button
                      onClick={() => handleRemoveFromCart(idx)}
                      aria-label={`Remove ${item.product.name}`}
                      className="absolute -right-3 -top-3 rounded-full bg-red-500 p-2 text-white shadow-md transition-colors hover:bg-red-400 focus:outline-none focus-visible:ring-2 focus-visible:ring-red-300"
                    >
                      <Trash2 size={16} />
                    </button>

                    <div className="flex items-start justify-between pr-4">
                      <div className="flex flex-col">
                        <span className="text-lg font-semibold leading-tight text-stone-50">{item.product.name}</span>
                        <span className="mt-1 w-fit rounded bg-stone-800 px-2 py-1 text-xs font-medium text-stone-400">{item.product.boxesPerCarton} boxes/carton</span>
                      </div>
                      <div className="text-right">
                        <span className="text-xl font-semibold text-amber-300 tabular-nums">{formatCurrency(item.amount)}</span>
                      </div>
                    </div>

                    <div className="mt-1 flex items-center justify-between rounded-lg border border-stone-800 bg-stone-900 p-3">
                      <div className="flex flex-col items-start">
                        <span className="mb-1 text-xs font-medium text-stone-500">Cartons</span>
                        <span className="text-xl font-semibold text-stone-100 tabular-nums">{item.qty}</span>
                      </div>
                      <div className="flex flex-col items-end">
                        <span className="mb-1 text-xs font-medium text-stone-500">Rate</span>
                        <span className="text-lg font-semibold text-stone-100 tabular-nums">{formatCurrency(item.ratePerCarton)}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Total footer */}
          <div className="flex flex-col items-center justify-between gap-4 rounded-b-xl border-t border-stone-800 p-4 sm:flex-row md:p-6">
            <div className="flex w-full flex-col items-center rounded-xl border border-stone-800 bg-stone-950/60 p-4 sm:w-auto sm:items-start">
              <span className="mb-1 text-sm font-medium text-stone-500">Grand total</span>
              <span className="text-3xl font-bold text-amber-300 tabular-nums md:text-4xl">{formatCurrency(grandTotal)}</span>
            </div>

            <button
              onClick={handleGenerateBill}
              disabled={cart.length === 0}
              className={`w-full rounded-xl px-8 py-4 text-lg font-semibold transition-colors sm:w-auto ${cart.length > 0
                  ? 'bg-emerald-500 text-stone-950 hover:bg-emerald-400'
                  : 'cursor-not-allowed bg-stone-800 text-stone-600'
                }`}
            >
              Generate bill
            </button>
          </div>
        </div>
      </div>

      {printStyles}
    </div>
  );
}