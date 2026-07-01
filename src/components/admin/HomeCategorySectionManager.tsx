import { useRef } from 'react';
import { Image as ImageIcon, Layers, Trash2 } from 'lucide-react';
import { useCategories } from '../../context/CategoriesContext';
import { useHome } from '../../context/HomeContext';

const toggleId = (ids: number[], id: number) =>
  ids.includes(id) ? ids.filter((item) => item !== id) : [...ids, id];

export default function HomeCategorySectionManager() {
  const { categories } = useCategories();
  const { settings, updateCategorySection } = useHome();
  const fileInputs = useRef<Record<number, HTMLInputElement | null>>({});
  const section = settings.categorySection;
  const visibleCategories = categories.filter((cat: any) => cat.visible);

  const uploadIcon = (categoryId: number, file?: File) => {
    if (!file) return;
    if (!file.type.startsWith('image/')) {
      alert('لطفاً فقط فایل تصویری انتخاب کنید');
      return;
    }
    if (file.size > 2 * 1024 * 1024) {
      alert('حجم تصویر نباید بیشتر از ۲ مگابایت باشد');
      return;
    }
    const reader = new FileReader();
    reader.onload = (event) => {
      updateCategorySection({
        categoryIcons: {
          ...section.categoryIcons,
          [categoryId]: event.target?.result as string,
        },
      });
    };
    reader.readAsDataURL(file);
  };

  return (
    <div className="space-y-4">
      <div className="bg-blue-50 border border-blue-200 rounded-2xl p-4 text-sm text-blue-900">
        این بخش مخصوص نمایش دسته‌بندی‌ها در صفحه ۱ است. فقط دسته‌بندی‌ها، زیرگروه‌ها و زیرگروه‌های فرعی انتخاب‌شده در صفحه خانه نمایش داده می‌شوند.
      </div>

      <div className="space-y-3">
        {visibleCategories.map((cat: any) => {
          const selectedCategory = section.selectedCategoryIds.includes(cat.id);
          const icon = section.categoryIcons[cat.id];
          const visibleChildren = cat.children.filter((sub: any) => sub.visible);

          return (
            <div key={cat.id} className="rounded-2xl border border-border/60 bg-white overflow-hidden">
              <div className="p-4 flex items-start gap-3 bg-light-bg/60">
                <label className="flex items-center gap-2 flex-1 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={selectedCategory}
                    onChange={() => updateCategorySection({
                      selectedCategoryIds: toggleId(section.selectedCategoryIds, cat.id),
                    })}
                    className="w-4 h-4 accent-blue-600"
                  />
                  <div className="min-w-0">
                    <p className="font-bold text-primary">{cat.name}</p>
                    <p className="text-xs text-text-secondary">{visibleChildren.length.toLocaleString('fa-IR')} زیرگروه فعال</p>
                  </div>
                </label>

                <div className="flex items-center gap-2">
                  <div className="w-12 h-12 rounded-2xl bg-white border border-border flex items-center justify-center overflow-hidden">
                    {icon ? (
                      <img src={icon} alt={cat.name} className="w-full h-full object-cover" />
                    ) : (
                      <Layers className="w-5 h-5 text-accent" />
                    )}
                  </div>
                  <button
                    onClick={() => fileInputs.current[cat.id]?.click()}
                    className="flex items-center gap-1.5 rounded-xl border border-accent/30 bg-accent/10 px-3 py-2 text-xs font-medium text-accent hover:bg-accent/15"
                  >
                    <ImageIcon className="w-3.5 h-3.5" />
                    آپلود آیکون
                  </button>
                  {icon && (
                    <button
                      onClick={() => {
                        const nextIcons = { ...section.categoryIcons };
                        delete nextIcons[cat.id];
                        updateCategorySection({ categoryIcons: nextIcons });
                      }}
                      className="rounded-xl p-2 text-danger hover:bg-red-50"
                      title="حذف آیکون"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  )}
                  <input
                    ref={(el) => { fileInputs.current[cat.id] = el; }}
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={(event) => uploadIcon(cat.id, event.target.files?.[0])}
                  />
                </div>
              </div>

              {selectedCategory && visibleChildren.length > 0 && (
                <div className="p-4 space-y-3">
                  {visibleChildren.map((sub: any) => {
                    const selectedSub = section.selectedSubCategoryIds.includes(sub.id);
                    const visibleSubSubs = sub.children.filter((item: any) => item.visible);
                    return (
                      <div key={sub.id} className="rounded-xl border border-border/50 bg-light-bg/40 p-3">
                        <label className="flex items-center gap-2 cursor-pointer">
                          <input
                            type="checkbox"
                            checked={selectedSub}
                            onChange={() => updateCategorySection({
                              selectedSubCategoryIds: toggleId(section.selectedSubCategoryIds, sub.id),
                            })}
                            className="w-4 h-4 accent-blue-600"
                          />
                          <span className="text-sm font-medium text-primary">{sub.name}</span>
                        </label>

                        {selectedSub && visibleSubSubs.length > 0 && (
                          <div className="mt-3 grid grid-cols-1 sm:grid-cols-2 gap-2 pr-6">
                            {visibleSubSubs.map((subsub: any) => (
                              <label key={subsub.id} className="flex items-center gap-2 rounded-lg bg-white border border-border/40 px-3 py-2 text-xs cursor-pointer">
                                <input
                                  type="checkbox"
                                  checked={section.selectedSubSubCategoryIds.includes(subsub.id)}
                                  onChange={() => updateCategorySection({
                                    selectedSubSubCategoryIds: toggleId(section.selectedSubSubCategoryIds, subsub.id),
                                  })}
                                  className="w-3.5 h-3.5 accent-blue-600"
                                />
                                <span className="text-primary">{subsub.name}</span>
                              </label>
                            ))}
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
