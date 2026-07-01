import { useState } from 'react';
import { ChevronDown, ChevronLeft, Edit2, Eye, EyeOff, FolderTree, Plus, Save, Trash2, X } from 'lucide-react';
import { Category, SubCategory, SubSubCategory, useCategories } from '../../context/CategoriesContext';

type TreeNode = Category | SubCategory | SubSubCategory;

function countNodes(nodes: TreeNode[]): number {
  return nodes.reduce((sum, node) => sum + 1 + countNodes((node.children || []) as TreeNode[]), 0);
}

function TreeNodeRow({
  node,
  level,
  onAddChild,
  onUpdate,
  onDelete,
  onToggle,
}: {
  node: TreeNode;
  level: number;
  onAddChild: (parentId: number, name: string) => void;
  onUpdate: (id: number, data: { name?: string; slug?: string; description?: string; visible?: boolean }) => void;
  onDelete: (id: number) => void;
  onToggle: (id: number) => void;
}) {
  const [open, setOpen] = useState(level < 2);
  const [adding, setAdding] = useState(false);
  const [newName, setNewName] = useState('');
  const [editing, setEditing] = useState(false);
  const [editName, setEditName] = useState(node.name);
  const children = (node.children || []) as TreeNode[];

  const addChild = () => {
    if (!newName.trim()) return;
    onAddChild(node.id, newName.trim());
    setNewName('');
    setAdding(false);
    setOpen(true);
  };

  const saveEdit = () => {
    if (!editName.trim()) return;
    onUpdate(node.id, { name: editName.trim() });
    setEditing(false);
  };

  return (
    <div className="space-y-2">
      <div
        className="bg-white border border-border/60 rounded-2xl p-3 flex items-center gap-2"
        style={{ marginRight: level * 18 }}
      >
        <button
          onClick={() => setOpen(!open)}
          className="w-8 h-8 rounded-xl hover:bg-light-bg flex items-center justify-center text-text-secondary"
          aria-label="باز و بسته کردن"
        >
          {children.length > 0 ? (
            open ? <ChevronDown className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />
          ) : (
            <span className="w-4" />
          )}
        </button>

        <button
          onClick={() => onToggle(node.id)}
          className={`w-9 h-5 rounded-full relative transition-colors ${node.visible ? 'bg-green-500' : 'bg-gray-300'}`}
          title={node.visible ? 'نمایش فعال است' : 'مخفی است'}
        >
          <span className={`absolute top-0.5 ${node.visible ? 'right-0.5' : 'right-5'} w-4 h-4 bg-white rounded-full shadow transition-all`} />
        </button>
        {node.visible ? <Eye className="w-4 h-4 text-green-600" /> : <EyeOff className="w-4 h-4 text-gray-400" />}

        <div className="flex-1 min-w-0">
          {editing ? (
            <div className="flex gap-2">
              <input
                value={editName}
                onChange={(e) => setEditName(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && saveEdit()}
                className="flex-1 bg-light-bg border border-border rounded-xl px-3 py-2 text-sm focus:outline-none focus:border-accent"
                autoFocus
              />
              <button onClick={saveEdit} className="p-2 text-green-600 hover:bg-green-50 rounded-xl">
                <Save className="w-4 h-4" />
              </button>
              <button onClick={() => setEditing(false)} className="p-2 text-text-secondary hover:bg-light-bg rounded-xl">
                <X className="w-4 h-4" />
              </button>
            </div>
          ) : (
            <div>
              <p className="font-bold text-primary truncate">{node.name}</p>
              <p className="text-[10px] text-text-secondary">
                سطح {level + 1} {children.length > 0 ? `• ${children.length.toLocaleString('fa-IR')} زیرگروه` : ''}
              </p>
            </div>
          )}
        </div>

        {!editing && (
          <div className="flex items-center gap-1">
            <button
              onClick={() => setAdding(true)}
              className="p-2 text-accent hover:bg-accent/10 rounded-xl"
              title="افزودن زیرگروه"
            >
              <Plus className="w-4 h-4" />
            </button>
            <button
              onClick={() => setEditing(true)}
              className="p-2 text-text-secondary hover:text-accent hover:bg-accent/10 rounded-xl"
              title="ویرایش"
            >
              <Edit2 className="w-4 h-4" />
            </button>
            <button
              onClick={() => {
                if (confirm(`«${node.name}» و همه زیرگروه‌های آن حذف شود؟`)) onDelete(node.id);
              }}
              className="p-2 text-text-secondary hover:text-danger hover:bg-red-50 rounded-xl"
              title="حذف"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          </div>
        )}
      </div>

      {adding && (
        <div className="flex gap-2" style={{ marginRight: (level + 1) * 18 }}>
          <input
            value={newName}
            onChange={(e) => setNewName(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && addChild()}
            placeholder={`نام زیرگروه سطح ${level + 2}...`}
            className="flex-1 bg-white border border-border rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-accent"
            autoFocus
          />
          <button onClick={addChild} className="bg-accent text-white px-4 py-2 rounded-xl text-sm">
            افزودن
          </button>
          <button onClick={() => setAdding(false)} className="bg-light-bg text-text-secondary px-4 py-2 rounded-xl text-sm">
            انصراف
          </button>
        </div>
      )}

      {open && children.length > 0 && (
        <div className="space-y-2">
          {children.map((child) => (
            <TreeNodeRow
              key={child.id}
              node={child}
              level={level + 1}
              onAddChild={onAddChild}
              onUpdate={onUpdate}
              onDelete={onDelete}
              onToggle={onToggle}
            />
          ))}
        </div>
      )}
    </div>
  );
}

export default function CategoriesManager() {
  const {
    categories,
    addCategory,
    addNestedCategory,
    updateNestedCategory,
    deleteNestedCategory,
    toggleNestedCategoryVisible,
  } = useCategories();
  const [newCategoryName, setNewCategoryName] = useState('');

  const addRootCategory = () => {
    if (!newCategoryName.trim()) return;
    addCategory(newCategoryName.trim(), '');
    setNewCategoryName('');
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-bold text-primary flex items-center gap-2">
          <FolderTree className="w-5 h-5" />
          مدیریت دسته‌بندی‌ها
        </h2>
        <p className="text-sm text-text-secondary mt-1">
          برای هر دسته‌بندی می‌توانید تا بی‌نهایت سطح زیرگروه بسازید. روی دکمه + کنار هر ردیف بزنید.
        </p>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
        <div className="bg-white rounded-2xl p-4 border border-border/50">
          <p className="text-xs text-text-secondary mb-1">دسته‌های اصلی</p>
          <p className="text-2xl font-bold text-primary">{categories.length.toLocaleString('fa-IR')}</p>
        </div>
        <div className="bg-white rounded-2xl p-4 border border-border/50">
          <p className="text-xs text-text-secondary mb-1">کل گره‌ها</p>
          <p className="text-2xl font-bold text-primary">{countNodes(categories as TreeNode[]).toLocaleString('fa-IR')}</p>
        </div>
        <div className="bg-white rounded-2xl p-4 border border-border/50">
          <p className="text-xs text-text-secondary mb-1">فعال</p>
          <p className="text-2xl font-bold text-green-600">
            {categories.filter((cat) => cat.visible).length.toLocaleString('fa-IR')}
          </p>
        </div>
      </div>

      <div className="bg-gradient-to-l from-accent/5 to-transparent rounded-2xl p-5 border-2 border-dashed border-accent/30">
        <h3 className="font-bold text-primary mb-3 flex items-center gap-2">
          <Plus className="w-4 h-4 text-accent" />
          افزودن دسته‌بندی اصلی
        </h3>
        <div className="flex flex-col sm:flex-row gap-3">
          <input
            value={newCategoryName}
            onChange={(e) => setNewCategoryName(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && addRootCategory()}
            placeholder="نام دسته‌بندی اصلی..."
            className="flex-1 bg-white border border-border rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-accent"
          />
          <button
            onClick={addRootCategory}
            disabled={!newCategoryName.trim()}
            className="bg-accent text-white px-6 py-2.5 rounded-xl text-sm font-medium hover:bg-accent-dark transition-colors disabled:opacity-50"
          >
            افزودن
          </button>
        </div>
      </div>

      <div className="space-y-3">
        {categories.map((category) => (
          <TreeNodeRow
            key={category.id}
            node={category}
            level={0}
            onAddChild={addNestedCategory}
            onUpdate={updateNestedCategory}
            onDelete={deleteNestedCategory}
            onToggle={toggleNestedCategoryVisible}
          />
        ))}
      </div>
    </div>
  );
}
