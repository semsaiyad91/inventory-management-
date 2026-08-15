"use client";

import React, { useState, useEffect } from 'react';
import { Plus, Trash2, Receipt, Printer, ArrowLeft, ShoppingCart } from 'lucide-react';

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
      setProducts(JSON.parse(savedProducts));
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
      const newCart = [...cart];
      const newTotalQty = newCart[existingIndex].qty + qty;
      if (newTotalQty > product.cartons) {
        alert(`Not enough stock! Only ${product.cartons} cartons available.`);
        return;
      }
      newCart[existingIndex].qty = newTotalQty;
      newCart[existingIndex].amount = newTotalQty * product.boxesPerCarton * product.sellPrice;
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
    const grandTotal = cart.reduce((sum, item) => sum + item.amount, 0);

    // Create Bill Object
    const bill = {
      id: `INV-${Date.now()}`,
      date: new Date().toLocaleString(),
      customerName,
      items: [...cart],
      grandTotal
    };

    // Save Bill to History (Optional, but good practice)
    const savedBills = JSON.parse(localStorage.getItem('stock_management_bills') || '[]');
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

  // === RENDER BILL RECEIPT VIEW ===
  if (generatedBill) {
    return (
      <div className="max-w-2xl mx-auto bg-white p-4 md:p-8 rounded-xl shadow-sm border border-slate-200">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8 print:hidden">
          <button 
            onClick={resetBilling}
            className="flex items-center gap-2 text-slate-600 hover:text-black font-bold transition-colors"
          >
            <ArrowLeft size={20} /> New Bill
          </button>
          <button 
            onClick={handlePrint}
            className="flex items-center justify-center w-full sm:w-auto gap-2 bg-emerald-600 hover:bg-emerald-700 text-white px-4 py-3 rounded-lg font-bold shadow-sm"
          >
            <Printer size={20} /> Print Receipt
          </button>
        </div>

        {/* Printable Area */}
        <div className="print-area text-black">
          <div className="text-center mb-8 border-b border-slate-300 pb-6">
            <h1 className="text-3xl font-black tracking-tight uppercase">Stock<span className="text-emerald-600">Management</span></h1>
            <p className="text-slate-600 mt-1 font-bold text-sm tracking-widest uppercase">Wholesale Invoice</p>
          </div>

          <div className="flex flex-col sm:flex-row justify-between mb-8 text-sm gap-4 bg-slate-50 p-4 rounded-xl border border-slate-200">
            <div>
              <p className="text-slate-500 font-bold uppercase text-xs tracking-wider mb-1">Billed To</p>
              <p className="font-black text-xl text-black">{generatedBill.customerName}</p>
            </div>
            <div className="sm:text-right">
              <p className="text-slate-500 font-bold text-sm mb-1">INV-NO: <span className="font-black text-black">{generatedBill.id}</span></p>
              <p className="text-slate-500 font-bold text-sm">DATE: <span className="font-black text-black">{generatedBill.date}</span></p>
            </div>
          </div>

          {/* Items List (Mobile Friendly) */}
          <div className="mb-8 border border-slate-200 rounded-xl overflow-hidden">
            <div className="bg-slate-100 p-3 border-b border-slate-300 flex justify-between">
              <span className="font-bold text-black uppercase text-sm tracking-wider">Items Summary</span>
            </div>
            
            <div className="flex flex-col divide-y divide-slate-200">
              {generatedBill.items.map((item, idx) => (
                <div key={idx} className="p-4 flex flex-col gap-3">
                  <div className="flex justify-between items-start">
                    <div>
                      <p className="font-black text-lg text-black">{item.product.name}</p>
                      <p className="text-xs text-slate-600 font-bold bg-slate-100 inline-block px-2 py-1 rounded mt-1">{item.product.boxesPerCarton} boxes / carton</p>
                    </div>
                    <p className="font-black text-lg text-emerald-700">{formatCurrency(item.amount)}</p>
                  </div>
                  
                  <div className="flex justify-between items-center text-sm bg-slate-50 p-2 rounded-lg border border-slate-100">
                    <div className="flex flex-col">
                      <span className="text-slate-500 font-bold text-xs uppercase">Qty (Cartons)</span>
                      <span className="font-black text-black">{item.qty}</span>
                    </div>
                    <div className="h-8 w-px bg-slate-300"></div>
                    <div className="flex flex-col items-end">
                      <span className="text-slate-500 font-bold text-xs uppercase">Rate / Carton</span>
                      <span className="font-black text-black">{formatCurrency(item.ratePerCarton)}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="flex justify-end">
            <div className="w-full sm:w-1/2 bg-slate-50 p-4 rounded-xl border-2 border-black">
              <div className="flex justify-between items-center">
                <span className="font-black text-xl text-black uppercase">Grand Total</span>
                <span className="font-black text-2xl text-emerald-700">{formatCurrency(generatedBill.grandTotal)}</span>
              </div>
            </div>
          </div>
          
          <div className="text-center mt-12 text-slate-500 font-bold text-sm">
            <p>Thank you for your business!</p>
          </div>
        </div>
      </div>
    );
  }

  // === RENDER BILLING INTERFACE ===
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-black text-black tracking-tight">Billing & Sales</h1>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        
        {/* Left Side: Product Selection Form */}
        <div className="xl:col-span-1 bg-white p-4 md:p-6 rounded-xl shadow-sm border border-slate-200 h-fit space-y-5">
          <h2 className="text-lg font-black text-black mb-2 border-b border-slate-200 pb-3 uppercase tracking-wider">Add Items</h2>
          
          <div>
            <label className="block text-sm font-bold text-black mb-2">Select Product</label>
            <select 
              value={selectedProductId}
              onChange={(e) => setSelectedProductId(e.target.value)}
              className="w-full px-4 py-3 border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500 font-bold text-black bg-slate-50"
            >
              <option value="">-- Select Product --</option>
              {products.map(p => (
                <option key={p.id} value={p.id} disabled={p.cartons <= 0} className="text-black font-bold">
                  {p.name} ({p.cartons} cartons left)
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-bold text-black mb-2">Quantity (Cartons)</label>
            <input 
              type="number" 
              value={sellCartons}
              onChange={(e) => setSellCartons(e.target.value)}
              placeholder="Enter quantity"
              min="1"
              className="w-full px-4 py-3 border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500 font-bold text-black bg-slate-50"
            />
          </div>

          <button 
            onClick={handleAddToCart}
            className="w-full flex items-center justify-center gap-2 bg-black text-white hover:bg-slate-800 py-3 md:py-4 rounded-xl font-black transition-colors shadow-md text-lg"
          >
            <Plus size={24} /> Add to Bill
          </button>
        </div>

        {/* Right Side: Current Bill / Cart */}
        <div className="xl:col-span-2 bg-white rounded-xl shadow-sm border border-slate-200 flex flex-col h-full min-h-[500px]">
          <div className="p-4 md:p-6 border-b border-slate-200 bg-slate-100 rounded-t-xl flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <h2 className="text-lg font-black text-black flex items-center gap-2 uppercase tracking-wider">
              <Receipt size={24} className="text-emerald-700"/> Current Invoice
            </h2>
            <div className="w-full sm:w-72">
              <input 
                type="text" 
                placeholder="Enter Customer Name"
                value={customerName}
                onChange={(e) => setCustomerName(e.target.value)}
                className="w-full px-4 py-3 border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500 font-bold text-black placeholder:text-slate-400 placeholder:font-medium bg-white"
              />
            </div>
          </div>

          <div className="flex-1 p-4 md:p-6 bg-slate-50">
            {cart.length === 0 ? (
              <div className="h-full min-h-[300px] flex flex-col items-center justify-center text-slate-400 bg-white rounded-xl border border-dashed border-slate-300 p-6">
                <ShoppingCart size={64} className="mb-4 opacity-30 text-slate-500" />
                <p className="font-bold text-slate-500 text-center text-lg">Cart is empty.<br/><span className="font-medium text-sm">Add products from the left panel.</span></p>
              </div>
            ) : (
              <div className="flex flex-col gap-4">
                {cart.map((item, idx) => (
                  <div key={idx} className="bg-white border border-slate-200 rounded-xl p-4 shadow-sm flex flex-col gap-3 relative">
                    <button 
                      onClick={() => handleRemoveFromCart(idx)} 
                      className="absolute -top-3 -right-3 text-white bg-red-500 hover:bg-red-600 p-2 rounded-full shadow-md transition-colors"
                    >
                      <Trash2 size={16} />
                    </button>
                    
                    <div className="flex justify-between items-start pr-4">
                      <div className="flex flex-col">
                        <span className="font-black text-lg text-black leading-tight">{item.product.name}</span>
                        <span className="text-xs font-bold text-slate-500 bg-slate-100 px-2 py-1 rounded w-fit mt-1">{item.product.boxesPerCarton} boxes/carton</span>
                      </div>
                      <div className="text-right">
                        <span className="font-black text-xl text-emerald-700">{formatCurrency(item.amount)}</span>
                      </div>
                    </div>

                    <div className="flex justify-between items-center bg-slate-50 border border-slate-100 rounded-lg p-3 mt-2">
                      <div className="flex flex-col items-start">
                        <span className="text-[10px] uppercase font-black tracking-widest text-slate-400 mb-1">Cartons</span>
                        <span className="font-black text-xl text-black">{item.qty}</span>
                      </div>
                      <div className="flex flex-col items-end">
                        <span className="text-[10px] uppercase font-black tracking-widest text-slate-400 mb-1">Rate</span>
                        <span className="font-black text-lg text-black">{formatCurrency(item.ratePerCarton)}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Grand Total Footer */}
          <div className="p-4 md:p-6 border-t border-slate-200 bg-white rounded-b-xl flex flex-col sm:flex-row justify-between items-center gap-4">
            <div className="flex flex-col w-full sm:w-auto items-center sm:items-start p-4 bg-slate-50 rounded-xl border border-slate-200">
              <span className="text-slate-500 font-black text-sm uppercase tracking-wider mb-1">Grand Total</span>
              <span className="text-3xl md:text-4xl font-black text-black">{formatCurrency(grandTotal)}</span>
            </div>
            
            <button 
              onClick={handleGenerateBill}
              disabled={cart.length === 0}
              className={`w-full sm:w-auto px-8 py-4 rounded-xl font-black text-lg transition-all shadow-md ${
                cart.length > 0 
                  ? 'bg-emerald-600 hover:bg-emerald-700 text-white' 
                  : 'bg-slate-200 text-slate-400 cursor-not-allowed shadow-none'
              }`}
            >
              GENERATE BILL
            </button>
          </div>
        </div>
      </div>
      
      <style dangerouslySetInnerHTML={{__html: `
        @media print {
          body * {
            visibility: hidden;
          }
          .print-area, .print-area * {
            visibility: visible;
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
    </div>
  );
}
