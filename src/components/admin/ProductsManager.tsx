import { useState } from 'react';
import { Plus, Edit, Trash2, Save, X } from 'lucide-react';

// Mock data for demonstration (replace with API calls)
const initialProducts = [
  { id: 1, name: 'پمپ تصفیه استخر', brand: 'استریم', price: 7013500, unit: 'عدد', stock: 7 },
  { id: 2, name: 'لوله پنج لایه', brand: 'نیوپایپ', price: 39150, unit: 'متر', stock: 120 },
];

const unitOptions = ['عدد', 'متر', 'شاخه', 'کیلوگرم', 'بسته', 'ست'];

export default function ProductsManager() {
  const [products, setProducts] = useState(initialProducts);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    brand: '',
    price: '',
    unit: 'عدد',
    stock: '',
    category_id: '',
    original_price: '',
    discount: '',
    sku: '',
    short_description: '',
    description: '',
    warranty: '',
    shipping_time: '',
    tags: '',
  });

  const handleOpenForm = (product: any = null) => {
    if (product) {
      setEditingId(product.id);
      setFormData({
        name: product.name || '',
        brand: product.brand || '',
        price: product.price?.toString() || '',
        unit: product.unit || 'عدد',
        stock: product.stock?.toString() || '',
        category_id: product.category_id?.toString() || '',
        original_price: product.original_price?.toString() || '',
        discount: product.discount?.toString() || '',
        sku: product.sku || '',
        short_description: product.short_description || '',
        description: product.description || '',
        warranty: product.warranty || '',
        shipping_time: product.shipping_time || '',
        tags: Array.isArray(product.tags) ? product.tags.join('، ') : '',
      });
    } else {
      setEditingId(null);
      setFormData({
        name: '', brand: '', price: '', unit: 'عدد', stock: '',
        category_id: '', original_price: '', discount: '', sku: '',
        short_description: '', description: '', warranty: '', shipping_time: '', tags: '',
      });
    }
    setIsFormOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const payload = {
      name: formData.name,
      brand: formData.brand,
      unit: formData.unit,
      price: Number(formData.price),
      original_price: formData.original_price ? Number(formData.original_price) : null,
      discount: formData.discount ? Number(formData.discount) : 0,
      stock_count: Number(formData.stock),
      sku: formData.sku,
      category_id: formData.category_id ? Number(formData.category_id) : null,
      short_description: formData.short_description,
      description: formData.description,
      warranty: formData.warranty,
      shipping_time: formData.shipping_time,
      tags: formData.tags.split('،').map(t => t.trim()).filter(Boolean),
    };

    try {
      // For demo purposes, update local state
      if (editingId) {
        setProducts(products.map(p => p.id === editingId ? { ...p, ...payload, id: editingId, stock: payload.stock_count } : p));
      } else {
        setProducts([...products, { ...payload, id: Date.now(), stock: payload.stock_count } as any]);
      }
      setIsFormOpen(false);
      
      /* Actual API logic:
      if (editingId) {
        await fetch(`/api/admin/products/${editingId}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload),
        });
      } else {
        await fetch('/api/admin/products', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload),
        });
      }
      */
    } catch (error) {
      alert('خطا در ذخیره محصول');
    }
  };

  const handleDelete = (id: number) => {
    // API call: DELETE /api/admin/products/{id}
    setProducts(products.filter(p => p.id !== id));
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-bold text-primary">مدیریت محصولات</h2>
        <button
          onClick={() => handleOpenForm()}
          className="flex items-center gap-2 bg-accent text-white px-4 py-2 rounded-xl text-sm hover:bg-accent-dark transition-colors"
        >
          <Plus className="w-4 h-4" />
          افزودن محصول جدید
        </button>
      </div>

      {/* Product List Table */}
      <div className="bg-white rounded-2xl border border-border/50 overflow-hidden">
        <table className="w-full text-sm text-right">
          <thead className="bg-light-bg">
            <tr>
              <th className="px-4 py-3 font-medium text-text-secondary">نام محصول</th>
              <th className="px-4 py-3 font-medium text-text-secondary">برند</th>
              <th className="px-4 py-3 font-medium text-text-secondary">قیمت (ریال)</th>
              <th className="px-4 py-3 font-medium text-text-secondary">واحد</th>
              <th className="px-4 py-3 font-medium text-text-secondary">موجودی</th>
              <th className="px-4 py-3 font-medium text-text-secondary text-center">عملیات</th>
            </tr>
          </thead>
          <tbody>
            {products.map((product: any) => (
              <tr key={product.id} className="border-t border-border/50 hover:bg-light-bg/50">
                <td className="px-4 py-3 text-primary font-medium">{product.name}</td>
                <td className="px-4 py-3">{product.brand}</td>
                <td className="px-4 py-3 text-sm">
                  <div className="font-medium">{product.price.toLocaleString('fa-IR')}</div>
                  {product.original_price && (
                    <div className="text-xs text-text-secondary line-through">
                      {product.original_price.toLocaleString('fa-IR')}
                    </div>
                  )}
                  {product.discount > 0 && (
                    <div className="text-xs text-green-600">%{product.discount} تخفیف</div>
                  )}
                </td>
                <td className="px-4 py-3">
                  <span className="px-2 py-1 rounded-lg bg-blue-100 text-blue-700 text-xs">
                    {product.unit}
                  </span>
                </td>
                <td className="px-4 py-3">{product.stock.toLocaleString('fa-IR')}</td>
                <td className="px-4 py-3">
                  <div className="flex items-center justify-center gap-2">
                    <button onClick={() => handleOpenForm(product)} className="text-blue-500 hover:text-blue-700">
                      <Edit className="w-4 h-4" />
                    </button>
                    <button onClick={() => handleDelete(product.id)} className="text-red-500 hover:text-red-700">
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Add/Edit Form Modal */}
      {isFormOpen && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl p-6 w-full max-w-lg max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-bold text-primary">
                {editingId ? 'ویرایش محصول' : 'افزودن محصول جدید'}
              </h3>
              <button onClick={() => setIsFormOpen(false)} className="text-text-secondary hover:text-primary">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-primary mb-1">نام محصول</label>
                <input
                  type="text"
                  required
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full bg-light-bg border border-border rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-accent"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-primary mb-1">برند</label>
                  <input
                    type="text"
                    required
                    value={formData.brand}
                    onChange={(e) => setFormData({ ...formData, brand: e.target.value })}
                    className="w-full bg-light-bg border border-border rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-accent"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-primary mb-1">واحد محصول</label>
                  <select
                    value={formData.unit}
                    onChange={(e) => setFormData({ ...formData, unit: e.target.value })}
                    className="w-full bg-light-bg border border-border rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-accent"
                  >
                    {unitOptions.map((unit) => (
                      <option key={unit} value={unit}>{unit}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-primary mb-1">قیمت اصلی (ریال)</label>
                  <input
                    type="number"
                    value={formData.original_price}
                    onChange={(e) => setFormData({ ...formData, original_price: e.target.value })}
                    className="w-full bg-light-bg border border-border rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-accent"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-primary mb-1">تخفیف (%)</label>
                  <input
                    type="number"
                    value={formData.discount}
                    onChange={(e) => setFormData({ ...formData, discount: e.target.value })}
                    className="w-full bg-light-bg border border-border rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-accent"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-primary mb-1">قیمت فروش (ریال)</label>
                  <input
                    type="number"
                    required
                    value={formData.price}
                    onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                    className="w-full bg-light-bg border border-border rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-accent"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-primary mb-1">موجودی انبار</label>
                  <input
                    type="number"
                    required
                    value={formData.stock}
                    onChange={(e) => setFormData({ ...formData, stock: e.target.value })}
                    className="w-full bg-light-bg border border-border rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-accent"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-primary mb-1">کد محصول (SKU)</label>
                <input
                  type="text"
                  required
                  value={formData.sku}
                  onChange={(e) => setFormData({ ...formData, sku: e.target.value })}
                  className="w-full bg-light-bg border border-border rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-accent"
                  dir="ltr"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-primary mb-1">توضیحات کوتاه</label>
                <textarea
                  value={formData.short_description}
                  onChange={(e) => setFormData({ ...formData, short_description: e.target.value })}
                  rows={3}
                  className="w-full bg-light-bg border border-border rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-accent"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-primary mb-1">توضیحات کامل</label>
                <textarea
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  rows={5}
                  className="w-full bg-light-bg border border-border rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-accent"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-primary mb-1">گارانتی</label>
                  <input
                    type="text"
                    value={formData.warranty}
                    onChange={(e) => setFormData({ ...formData, warranty: e.target.value })}
                    className="w-full bg-light-bg border border-border rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-accent"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-primary mb-1">زمان ارسال</label>
                  <input
                    type="text"
                    value={formData.shipping_time}
                    onChange={(e) => setFormData({ ...formData, shipping_time: e.target.value })}
                    className="w-full bg-light-bg border border-border rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-accent"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-primary mb-1">برچسب‌ها (با کاما جدا کنید)</label>
                <input
                  type="text"
                  value={formData.tags}
                  onChange={(e) => setFormData({ ...formData, tags: e.target.value })}
                  className="w-full bg-light-bg border border-border rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-accent"
                />
              </div>

              <div className="flex items-center gap-3 mt-6 pt-4 border-t border-border">
                <button
                  type="button"
                  onClick={() => setIsFormOpen(false)}
                  className="flex-1 bg-light-bg text-text-secondary py-2.5 rounded-xl text-sm font-medium hover:bg-gray-200 transition-colors flex items-center justify-center gap-2"
                >
                  <X className="w-4 h-4" />
                  انصراف
                </button>
                <button
                  type="submit"
                  className="flex-1 bg-accent text-white py-2.5 rounded-xl text-sm font-medium hover:bg-accent-dark transition-colors flex items-center justify-center gap-2"
                >
                  <Save className="w-4 h-4" />
                  ذخیره محصول
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
