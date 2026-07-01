import { useState } from 'react';
import { MapPin, Plus, Trash2, Check } from 'lucide-react';

interface Address {
  id: number;
  title: string;
  province: string;
  city: string;
  fullAddress: string;
  postalCode: string;
  phone: string;
  isDefault: boolean;
}

// Mock Data
const initialAddresses: Address[] = [
  { id: 1, title: 'منزل', province: 'تهران', city: 'تهران', fullAddress: 'خیابان ولیعصر، کوچه مهر، پلاک ۱۲', postalCode: '1234567890', phone: '09123456789', isDefault: true },
  { id: 2, title: 'محل کار', province: 'تهران', city: 'کرج', fullAddress: 'بلوار کشاورز، ساختمان نگین', postalCode: '0987654321', phone: '09129876543', isDefault: false },
];

interface AddressManagerProps {
  onSelect: (address: Address) => void;
  selectedId?: number | null;
}

export default function AddressManager({ onSelect, selectedId }: AddressManagerProps) {
  const [addresses, setAddresses] = useState<Address[]>(initialAddresses);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState<Partial<Address>>({ title: '', province: '', city: '', fullAddress: '', postalCode: '', phone: '' });

  // Security: Sanitize text inputs
  const sanitize = (text: string) => text.replace(/[<>]/g, '').trim();

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    const newAddress: Address = {
      id: Date.now(),
      title: sanitize(formData.title || 'آدرس جدید'),
      province: sanitize(formData.province || ''),
      city: sanitize(formData.city || ''),
      fullAddress: sanitize(formData.fullAddress || ''),
      postalCode: sanitize(formData.postalCode || ''),
      phone: sanitize(formData.phone || ''),
      isDefault: addresses.length === 0,
    };
    setAddresses([...addresses, newAddress]);
    setShowForm(false);
    setFormData({ title: '', province: '', city: '', fullAddress: '', postalCode: '', phone: '' });
    onSelect(newAddress);
  };

  const handleDelete = (id: number) => {
    setAddresses(addresses.filter(a => a.id !== id));
    if (selectedId === id) onSelect(addresses[0] || ({} as Address));
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between mb-4">
        <h3 className="font-bold text-primary flex items-center gap-2">
          <MapPin className="w-5 h-5 text-accent" />
          انتخاب آدرس ارسال
        </h3>
        <button
          onClick={() => setShowForm(!showForm)}
          className="text-xs text-accent hover:text-accent-dark font-bold flex items-center gap-1 bg-accent/10 px-3 py-1.5 rounded-lg"
        >
          <Plus className="w-3 h-3" />
          آدرس جدید
        </button>
      </div>

      {/* Add Address Form */}
      {showForm && (
        <form onSubmit={handleSave} className="bg-light-bg p-4 rounded-2xl border border-border/50 space-y-3 animate-fade-in-up mb-4">
          <div className="grid grid-cols-2 gap-3">
            <input required placeholder="عنوان (مثلاً منزل)" className="input-style" value={formData.title} onChange={e => setFormData({...formData, title: e.target.value})} />
            <input required placeholder="شماره موبایل" className="input-style" value={formData.phone} onChange={e => setFormData({...formData, phone: e.target.value})} />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <input required placeholder="استان" className="input-style" value={formData.province} onChange={e => setFormData({...formData, province: e.target.value})} />
            <input required placeholder="شهر" className="input-style" value={formData.city} onChange={e => setFormData({...formData, city: e.target.value})} />
          </div>
          <textarea required placeholder="آدرس کامل..." rows={2} className="input-style w-full" value={formData.fullAddress} onChange={e => setFormData({...formData, fullAddress: e.target.value})} />
          <input required placeholder="کد پستی (۱۰ رقم)" className="input-style w-full" value={formData.postalCode} onChange={e => setFormData({...formData, postalCode: e.target.value})} />
          <div className="flex gap-2 pt-2">
            <button type="submit" className="flex-1 bg-primary text-white py-2 rounded-xl text-sm font-bold">ذخیره</button>
            <button type="button" onClick={() => setShowForm(false)} className="flex-1 bg-white border border-border text-text-secondary py-2 rounded-xl text-sm">انصراف</button>
          </div>
        </form>
      )}

      {/* Address List */}
      <div className="space-y-3 max-h-[300px] overflow-y-auto custom-scrollbar pr-1">
        {addresses.map((addr) => (
          <div
            key={addr.id}
            onClick={() => onSelect(addr)}
            className={`relative p-4 rounded-2xl border-2 cursor-pointer transition-all ${
              selectedId === addr.id
                ? 'border-accent bg-accent/5 shadow-md'
                : 'border-border/50 bg-white hover:border-accent/30'
            }`}
          >
            <div className="flex justify-between items-start mb-2">
              <div className="flex items-center gap-2">
                <span className="font-bold text-sm text-primary">{addr.title}</span>
                {addr.isDefault && <span className="text-[10px] bg-green-100 text-green-700 px-1.5 py-0.5 rounded">پیش‌فرض</span>}
              </div>
              {selectedId === addr.id && <Check className="w-5 h-5 text-accent" />}
            </div>
            <p className="text-xs text-text-secondary mb-1 line-clamp-2">{addr.province}، {addr.city}، {addr.fullAddress}</p>
            <div className="flex items-center justify-between text-[10px] text-text-secondary dir-ltr">
              <span>{addr.phone}</span>
              <span>{addr.postalCode}</span>
            </div>
            
            {/* Delete Button (Only if not selected to avoid accidental clicks, or add a specific delete mode) */}
            <button
              onClick={(e) => { e.stopPropagation(); handleDelete(addr.id); }}
              className="absolute top-2 left-2 p-1.5 text-red-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
            >
              <Trash2 className="w-3.5 h-3.5" />
            </button>
          </div>
        ))}
        {addresses.length === 0 && !showForm && (
          <div className="text-center py-8 text-text-secondary text-sm bg-light-bg rounded-2xl border border-dashed border-border">
            هیچ آدرسی ثبت نشده است.
          </div>
        )}
      </div>
    </div>
  );
}
