import { useState } from 'react';
import { Search, Filter, Edit, Trash2, Shield, ShieldCheck, User, Clock } from 'lucide-react';

// Mock Data (Replace with API call: GET /api/admin/users)
const initialUsers = [
  { id: 1, uuid: '550e8400-e29b-41d4-a716-446655440000', name: 'سوپر ادمین', email: 'admin@dornika.com', phone: '09123456789', role: 'super_admin' as const, is_verified: true, last_login_at: '1402/10/01 10:30' },
  { id: 2, uuid: '550e8400-e29b-41d4-a716-446655440001', name: 'علی محمدی', email: 'ali@example.com', phone: '09121112233', role: 'customer' as const, is_verified: true, last_login_at: '1402/10/02 14:15' },
  { id: 3, uuid: '550e8400-e29b-41d4-a716-446655440002', name: 'سارا احمدی', email: 'sara@example.com', phone: '09124445566', role: 'admin' as const, is_verified: true, last_login_at: '1402/10/03 09:00' },
  { id: 4, uuid: '550e8400-e29b-41d4-a716-446655440003', name: 'رضا کریمی', email: null, phone: '09127778899', role: 'customer' as const, is_verified: false, last_login_at: null },
];

const roleLabels: Record<string, string> = {
  customer: 'مشتری',
  admin: 'مدیر',
  super_admin: 'سوپر ادمین',
};

const roleColors: Record<string, string> = {
  customer: 'bg-gray-100 text-gray-700 border-gray-200',
  admin: 'bg-blue-100 text-blue-700 border-blue-200',
  super_admin: 'bg-amber-100 text-amber-700 border-amber-200',
};

export default function UsersManager() {
  const [users, setUsers] = useState(initialUsers);
  const [search, setSearch] = useState('');
  const [roleFilter, setRoleFilter] = useState('all');
  const [editingId, setEditingId] = useState<number | null>(null);

  // Filter logic
  const filteredUsers = users.filter(user => {
    const matchesSearch = user.name.includes(search) || (user.phone && user.phone.includes(search)) || (user.email && user.email.includes(search));
    const matchesRole = roleFilter === 'all' || user.role === roleFilter;
    return matchesSearch && matchesRole;
  });

  const handleRoleChange = (userId: number, newRole: string) => {
    // API Call: PUT /api/admin/users/{id} { role: newRole }
    setUsers(users.map(u => u.id === userId ? { ...u, role: newRole as any } : u));
    setEditingId(null);
  };

  const handleDelete = (userId: number) => {
    if (window.confirm('آیا از حذف این کاربر اطمینان دارید؟')) {
      // API Call: DELETE /api/admin/users/{id}
      setUsers(users.filter(u => u.id !== userId));
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <h2 className="text-xl font-bold text-primary flex items-center gap-2">
          <User className="w-6 h-6 text-accent" />
          مدیریت کاربران
        </h2>
        <div className="text-sm text-text-secondary">
          تعداد کل کاربران: <span className="font-bold text-primary">{users.length.toLocaleString('fa-IR')}</span>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white p-4 rounded-2xl border border-border/50 flex flex-col sm:flex-row gap-4 shadow-sm">
        <div className="relative flex-1">
          <Search className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-text-secondary" />
          <input
            type="text"
            placeholder="جستجو بر اساس نام، ایمیل یا شماره موبایل..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full bg-light-bg border border-border rounded-xl py-2.5 pr-10 pl-4 text-sm focus:outline-none focus:border-accent transition-colors"
          />
        </div>
        <div className="relative w-full sm:w-48">
          <Filter className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-text-secondary" />
          <select
            value={roleFilter}
            onChange={(e) => setRoleFilter(e.target.value)}
            className="w-full bg-light-bg border border-border rounded-xl py-2.5 pr-10 pl-4 text-sm focus:outline-none focus:border-accent appearance-none transition-colors"
          >
            <option value="all">همه نقش‌ها</option>
            <option value="customer">مشتریان</option>
            <option value="admin">مدیران</option>
            <option value="super_admin">سوپر ادمین</option>
          </select>
        </div>
      </div>

      {/* Users Table */}
      <div className="bg-white rounded-2xl border border-border/50 overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-right">
            <thead className="bg-light-bg border-b border-border/50">
              <tr>
                <th className="px-6 py-4 font-medium text-text-secondary">کاربر</th>
                <th className="px-6 py-4 font-medium text-text-secondary">اطلاعات تماس</th>
                <th className="px-6 py-4 font-medium text-text-secondary">نقش</th>
                <th className="px-6 py-4 font-medium text-text-secondary">وضعیت</th>
                <th className="px-6 py-4 font-medium text-text-secondary">آخرین ورود</th>
                <th className="px-6 py-4 font-medium text-text-secondary text-center">عملیات</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border/50">
              {filteredUsers.map((user) => (
                <tr key={user.id} className="hover:bg-light-bg/50 transition-colors">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-accent/10 flex items-center justify-center text-accent font-bold text-lg">
                        {user.name.charAt(0)}
                      </div>
                      <div>
                        <div className="font-bold text-primary">{user.name}</div>
                        <div className="text-[10px] text-text-secondary font-mono dir-ltr text-left mt-0.5 opacity-60">UUID: {user.uuid.substring(0, 8)}...</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="space-y-1">
                      {user.email && (
                        <div className="text-text-secondary text-xs dir-ltr text-left font-mono">{user.email}</div>
                      )}
                      {user.phone && (
                        <div className="text-text-secondary text-xs dir-ltr text-left font-mono">{user.phone}</div>
                      )}
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    {editingId === user.id ? (
                      <select
                        value={user.role}
                        onChange={(e) => handleRoleChange(user.id, e.target.value)}
                        onBlur={() => setEditingId(null)}
                        className="bg-white border border-accent rounded-lg text-xs py-1 px-2 focus:outline-none w-full"
                        autoFocus
                      >
                        <option value="customer">مشتری</option>
                        <option value="admin">مدیر</option>
                        <option value="super_admin">سوپر ادمین</option>
                      </select>
                    ) : (
                      <span
                        onClick={() => setEditingId(user.id)}
                        className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium border cursor-pointer hover:opacity-80 transition-opacity ${roleColors[user.role]}`}
                      >
                        {user.role === 'super_admin' ? <ShieldCheck className="w-3 h-3" /> : user.role === 'admin' ? <Shield className="w-3 h-3" /> : <User className="w-3 h-3" />}
                        {roleLabels[user.role]}
                      </span>
                    )}
                  </td>
                  <td className="px-6 py-4">
                    {user.is_verified ? (
                      <span className="inline-flex items-center gap-1 text-xs text-green-600 bg-green-50 px-2 py-1 rounded-lg border border-green-100">
                        <span className="w-1.5 h-1.5 rounded-full bg-green-500"></span>
                        تایید شده
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1 text-xs text-amber-600 bg-amber-50 px-2 py-1 rounded-lg border border-amber-100">
                        <span className="w-1.5 h-1.5 rounded-full bg-amber-500"></span>
                        در انتظار تایید
                      </span>
                    )}
                  </td>
                  <td className="px-6 py-4">
                    {user.last_login_at ? (
                      <div className="flex items-center gap-1.5 text-xs text-text-secondary">
                        <Clock className="w-3.5 h-3.5" />
                        {user.last_login_at}
                      </div>
                    ) : (
                      <span className="text-xs text-text-secondary/50">هرگز</span>
                    )}
                  </td>
                  <td className="px-6 py-4 text-center">
                    <div className="flex items-center justify-center gap-2">
                      <button
                        onClick={() => setEditingId(user.id)}
                        className="p-2 rounded-lg text-blue-500 hover:bg-blue-50 transition-colors"
                        title="تغییر نقش"
                      >
                        <Edit className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleDelete(user.id)}
                        className="p-2 rounded-lg text-red-500 hover:bg-red-50 transition-colors"
                        title="حذف کاربر"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {filteredUsers.length === 0 && (
          <div className="p-12 text-center text-text-secondary">
            کاربری با این مشخصات یافت نشد.
          </div>
        )}
      </div>
    </div>
  );
}
