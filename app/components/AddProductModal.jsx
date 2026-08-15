import React, { useState } from 'react';
import { X } from 'lucide-react';

const AddProductModal = ({ isOpen, onClose, onAddProduct }) => {
  const [formData, setFormData] = useState({
    name: '',
    cartons: '',
    boxesPerCarton: '',
    buyPrice: '',
    sellPrice: ''
  });

  if (!isOpen) return null;

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Validate inputs
    if (!formData.name || !formData.cartons || !formData.boxesPerCarton || !formData.buyPrice || !formData.sellPrice) {
      alert("Please fill all fields");
      return;
    }

    const cartons = parseInt(formData.cartons);
    const boxesPerCarton = parseInt(formData.boxesPerCarton);

    const newProduct = {
      id: Date.now(),
      name: formData.name,
      cartons: cartons,
      boxesPerCarton: boxesPerCarton,
      buyPrice: parseFloat(formData.buyPrice),
      sellPrice: parseFloat(formData.sellPrice),
    };

    onAddProduct(newProduct);
    setFormData({ name: '', cartons: '', boxesPerCarton: '', buyPrice: '', sellPrice: '' });
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-xl shadow-lg w-full max-w-md overflow-hidden">
        
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-slate-100">
          <h2 className="text-xl font-bold text-slate-800">Add New Product</h2>
          <button onClick={onClose} className="text-slate-400 hover:text-slate-600">
            <X size={24} />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Item Name</label>
            <input 
              type="text" 
              name="name"
              value={formData.name}
              onChange={handleChange}
              placeholder="e.g. Parle-G" 
              className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Number of Cartons</label>
              <input 
                type="number" 
                name="cartons"
                value={formData.cartons}
                onChange={handleChange}
                placeholder="0" 
                className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Boxes per Carton</label>
              <input 
                type="number" 
                name="boxesPerCarton"
                value={formData.boxesPerCarton}
                onChange={handleChange}
                placeholder="0" 
                className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Buy Price (₹)</label>
              <input 
                type="number" 
                name="buyPrice"
                value={formData.buyPrice}
                onChange={handleChange}
                placeholder="0.00" 
                className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Sell Price (₹)</label>
              <input 
                type="number" 
                name="sellPrice"
                value={formData.sellPrice}
                onChange={handleChange}
                placeholder="0.00" 
                className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
              />
            </div>
          </div>

          <div className="pt-4 flex items-center justify-end gap-3 border-t border-slate-100">
            <button 
              type="button" 
              onClick={onClose}
              className="px-4 py-2 text-slate-600 hover:bg-slate-50 rounded-lg font-medium transition-colors"
            >
              Cancel
            </button>
            <button 
              type="submit" 
              className="px-6 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg font-medium transition-colors shadow-sm"
            >
              Save Item
            </button>
          </div>
        </form>

      </div>
    </div>
  );
};

export default AddProductModal;
