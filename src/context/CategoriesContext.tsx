import { createContext, useContext, ReactNode } from 'react';
import { useHistory } from './HistoryContext';

export interface SubSubCategory {
  id: number;
  name: string;
  slug?: string;
  description?: string;
  visible: boolean;
  children?: SubSubCategory[];
}

export interface SubCategory {
  id: number;
  name: string;
  slug?: string;
  description?: string;
  icon?: string;
  visible: boolean;
  children: SubSubCategory[];
}

export interface Category {
  id: number;
  name: string;
  slug?: string;
  description?: string;
  icon: string;
  visible: boolean;
  children: SubCategory[];
}

interface CategoriesContextType {
  categories: Category[];
  addCategory: (name: string, icon: string) => void;
  updateCategory: (id: number, data: Partial<Omit<Category, 'children' | 'id'>>) => void;
  deleteCategory: (id: number) => void;
  toggleCategoryVisible: (id: number) => void;

  addSubCategory: (categoryId: number, name: string) => void;
  updateSubCategory: (categoryId: number, subId: number, data: Partial<Omit<SubCategory, 'children' | 'id'>>) => void;
  deleteSubCategory: (categoryId: number, subId: number) => void;
  toggleSubCategoryVisible: (categoryId: number, subId: number) => void;

  addSubSubCategory: (categoryId: number, subId: number, name: string) => void;
  updateSubSubCategory: (categoryId: number, subId: number, subSubId: number, data: Partial<Omit<SubSubCategory, 'id'>>) => void;
  deleteSubSubCategory: (categoryId: number, subId: number, subSubId: number) => void;
  toggleSubSubCategoryVisible: (categoryId: number, subId: number, subSubId: number) => void;

  moveSubCategory: (categoryId: number, subId: number, direction: 'up' | 'down') => void;
  moveSubSubCategory: (categoryId: number, subId: number, subSubId: number, direction: 'up' | 'down') => void;

  addNestedCategory: (parentId: number, name: string) => void;
  updateNestedCategory: (id: number, data: { name?: string; slug?: string; description?: string; visible?: boolean }) => void;
  deleteNestedCategory: (id: number) => void;
  toggleNestedCategoryVisible: (id: number) => void;
}

const defaultCategories: Category[] = [
  {
    id: 1, name: 'تأسیسات و لوله‌کشی', slug: 'plumbing', icon: '🔧', visible: true, description: 'انواع لوله، اتصالات و شیرآلات ساختمان',
    children: [
      { id: 11, name: 'لوله‌ها', slug: 'pipes', icon: '📏', visible: true, children: [{ id: 111, name: 'لوله پلی‌اتیلن', visible: true }, { id: 112, name: 'لوله PVC', visible: true }] },
      { id: 12, name: 'اتصالات', slug: 'fittings', icon: '🔩', visible: true, children: [{ id: 121, name: 'زانویی', visible: true }] },
    ],
  },
  { id: 2, name: 'لوازم و تجهیزات استخر', slug: 'pool', icon: '🏊', visible: true, children: [{ id: 21, name: 'پمپ استخر', visible: true, children: [{ id: 211, name: 'پمپ تصفیه', visible: true }] }] },
  { id: 3, name: 'گرمایش ساختمان', slug: 'heating', icon: '🔥', visible: true, children: [{ id: 31, name: 'پکیج', visible: true, children: [{ id: 311, name: 'پکیج دیواری', visible: true }] }] },
  { id: 4, name: 'سرمایش ساختمان', slug: 'cooling', icon: '❄️', visible: true, children: [{ id: 41, name: 'اسپلیت', visible: true, children: [] }] },
  { id: 5, name: 'شیرآلات بهداشتی', slug: 'faucets', icon: '🚿', visible: true, children: [{ id: 51, name: 'شیر دوش', visible: true, children: [] }] },
  { id: 6, name: 'تجهیزات موتورخانه', slug: 'boiler-room', icon: '🏭', visible: true, children: [{ id: 61, name: 'مشعل', visible: true, children: [] }] },
  { id: 7, name: 'عایق و لرزه‌گیر', slug: 'insulation', icon: '🛡️', visible: true, children: [] },
  { id: 8, name: 'پمپ و بوستر پمپ', slug: 'booster-pump', icon: '🚀', visible: true, children: [] },
  { id: 9, name: 'تصفیه آب خانگی', slug: 'water-purification', icon: '💧', visible: true, children: [] },
  { id: 10, name: 'ابزارآلات تخصصی', slug: 'tools', icon: '🛠️', visible: true, children: [] },
  { id: 11, name: 'تجهیزات هوشمند', slug: 'smart-home', icon: '📱', visible: true, children: [] },
  { id: 12, name: 'لوازم مصرفی', slug: 'consumables', icon: '📦', visible: true, children: [] },
];

const CategoriesContext = createContext<CategoriesContextType | undefined>(undefined);

export { defaultCategories };

export const CategoriesProvider = ({ children }: { children: ReactNode }) => {
  const { state, updateState } = useHistory();
  const categories: Category[] = state.categories || defaultCategories;

  const setCategories = (updater: (prev: Category[]) => Category[]) => {
    updateState('categories', updater(categories));
  };

  const addCategory = (name: string, icon: string) => {
    setCategories((prev) => [
      ...prev,
      { id: Date.now(), name, icon, visible: true, children: [] },
    ]);
  };

  const updateCategory = (id: number, data: Partial<Omit<Category, 'children' | 'id'>>) => {
    setCategories((prev) =>
      prev.map((c) => (c.id === id ? { ...c, ...data } : c))
    );
  };

  const deleteCategory = (id: number) => {
    setCategories((prev) => prev.filter((c) => c.id !== id));
  };

  const toggleCategoryVisible = (id: number) => {
    setCategories((prev) =>
      prev.map((c) => (c.id === id ? { ...c, visible: !c.visible } : c))
    );
  };

  const addSubCategory = (categoryId: number, name: string) => {
    setCategories((prev) =>
      prev.map((c) =>
        c.id === categoryId
          ? {
              ...c,
              children: [
                ...c.children,
                { id: Date.now(), name, visible: true, children: [], icon: '📁' },
              ],
            }
          : c
      )
    );
  };

  const updateSubCategory = (
    categoryId: number,
    subId: number,
    data: Partial<Omit<SubCategory, 'children' | 'id'>>
  ) => {
    setCategories((prev) =>
      prev.map((c) =>
        c.id === categoryId
          ? {
              ...c,
              children: c.children.map((s) =>
                s.id === subId ? { ...s, ...data } : s
              ),
            }
          : c
      )
    );
  };

  const deleteSubCategory = (categoryId: number, subId: number) => {
    setCategories((prev) =>
      prev.map((c) =>
        c.id === categoryId
          ? { ...c, children: c.children.filter((s) => s.id !== subId) }
          : c
      )
    );
  };

  const toggleSubCategoryVisible = (categoryId: number, subId: number) => {
    setCategories((prev) =>
      prev.map((c) =>
        c.id === categoryId
          ? {
              ...c,
              children: c.children.map((s) =>
                s.id === subId ? { ...s, visible: !s.visible } : s
              ),
            }
          : c
      )
    );
  };

  const addSubSubCategory = (categoryId: number, subId: number, name: string) => {
    setCategories((prev) =>
      prev.map((c) =>
        c.id === categoryId
          ? {
              ...c,
              children: c.children.map((s) =>
                s.id === subId
                  ? {
                      ...s,
                      children: [
                        ...s.children,
                        { id: Date.now(), name, visible: true },
                      ],
                    }
                  : s
              ),
            }
          : c
      )
    );
  };

  const updateSubSubCategory = (
    categoryId: number,
    subId: number,
    subSubId: number,
    data: Partial<Omit<SubSubCategory, 'id'>>
  ) => {
    setCategories((prev) =>
      prev.map((c) =>
        c.id === categoryId
          ? {
              ...c,
              children: c.children.map((s) =>
                s.id === subId
                  ? {
                      ...s,
                      children: s.children.map((ss) =>
                        ss.id === subSubId ? { ...ss, ...data } : ss
                      ),
                    }
                  : s
              ),
            }
          : c
      )
    );
  };

  const deleteSubSubCategory = (
    categoryId: number,
    subId: number,
    subSubId: number
  ) => {
    setCategories((prev) =>
      prev.map((c) =>
        c.id === categoryId
          ? {
              ...c,
              children: c.children.map((s) =>
                s.id === subId
                  ? { ...s, children: s.children.filter((ss) => ss.id !== subSubId) }
                  : s
              ),
            }
          : c
      )
    );
  };

  const toggleSubSubCategoryVisible = (
    categoryId: number,
    subId: number,
    subSubId: number
  ) => {
    setCategories((prev) =>
      prev.map((c) =>
        c.id === categoryId
          ? {
              ...c,
              children: c.children.map((s) =>
                s.id === subId
                  ? {
                      ...s,
                      children: s.children.map((ss) =>
                        ss.id === subSubId ? { ...ss, visible: !ss.visible } : ss
                      ),
                    }
                  : s
              ),
            }
          : c
      )
    );
  };

  const moveSubCategory = (
    categoryId: number,
    subId: number,
    direction: 'up' | 'down'
  ) => {
    setCategories((prev) =>
      prev.map((c) => {
        if (c.id !== categoryId) return c;
        const idx = c.children.findIndex((s) => s.id === subId);
        if (idx === -1) return c;
        const newIdx = direction === 'up' ? idx - 1 : idx + 1;
        if (newIdx < 0 || newIdx >= c.children.length) return c;
        const newChildren = [...c.children];
        [newChildren[idx], newChildren[newIdx]] = [newChildren[newIdx], newChildren[idx]];
        return { ...c, children: newChildren };
      })
    );
  };

  const moveSubSubCategory = (
    categoryId: number,
    subId: number,
    subSubId: number,
    direction: 'up' | 'down'
  ) => {
    setCategories((prev) =>
      prev.map((c) => {
        if (c.id !== categoryId) return c;
        return {
          ...c,
          children: c.children.map((s) => {
            if (s.id !== subId) return s;
            const idx = s.children.findIndex((ss) => ss.id === subSubId);
            if (idx === -1) return s;
            const newIdx = direction === 'up' ? idx - 1 : idx + 1;
            if (newIdx < 0 || newIdx >= s.children.length) return s;
            const newChildren = [...s.children];
            [newChildren[idx], newChildren[newIdx]] = [newChildren[newIdx], newChildren[idx]];
            return { ...s, children: newChildren };
          }),
        };
      })
    );
  };

  type AnyNode = Category | SubCategory | SubSubCategory;

  const addNestedCategory = (parentId: number, name: string) => {
    const addToNodes = (nodes: AnyNode[]): AnyNode[] =>
      nodes.map((node) => {
        if (node.id === parentId) {
          const children = ('children' in node && node.children ? node.children : []) as AnyNode[];
          return {
            ...node,
            children: [
              ...children,
              { id: Date.now(), name, visible: true, children: [] } as SubSubCategory,
            ],
          } as AnyNode;
        }
        if ('children' in node && node.children) {
          return { ...node, children: addToNodes(node.children as AnyNode[]) } as AnyNode;
        }
        return node;
      });

    setCategories((prev) => addToNodes(prev as AnyNode[]) as Category[]);
  };

  const updateNestedCategory = (
    id: number,
    data: { name?: string; slug?: string; description?: string; visible?: boolean }
  ) => {
    const updateNodes = (nodes: AnyNode[]): AnyNode[] =>
      nodes.map((node) => {
        if (node.id === id) return { ...node, ...data } as AnyNode;
        if ('children' in node && node.children) {
          return { ...node, children: updateNodes(node.children as AnyNode[]) } as AnyNode;
        }
        return node;
      });

    setCategories((prev) => updateNodes(prev as AnyNode[]) as Category[]);
  };

  const deleteNestedCategory = (id: number) => {
    const deleteFromNodes = (nodes: AnyNode[]): AnyNode[] =>
      nodes
        .filter((node) => node.id !== id)
        .map((node) => {
          if ('children' in node && node.children) {
            return { ...node, children: deleteFromNodes(node.children as AnyNode[]) } as AnyNode;
          }
          return node;
        });

    setCategories((prev) => deleteFromNodes(prev as AnyNode[]) as Category[]);
  };

  const toggleNestedCategoryVisible = (id: number) => {
    const toggleNodes = (nodes: AnyNode[]): AnyNode[] =>
      nodes.map((node) => {
        if (node.id === id) return { ...node, visible: !node.visible } as AnyNode;
        if ('children' in node && node.children) {
          return { ...node, children: toggleNodes(node.children as AnyNode[]) } as AnyNode;
        }
        return node;
      });

    setCategories((prev) => toggleNodes(prev as AnyNode[]) as Category[]);
  };

  return (
    <CategoriesContext.Provider
      value={{
        categories,
        addCategory,
        updateCategory,
        deleteCategory,
        toggleCategoryVisible,
        addSubCategory,
        updateSubCategory,
        deleteSubCategory,
        toggleSubCategoryVisible,
        addSubSubCategory,
        updateSubSubCategory,
        deleteSubSubCategory,
        toggleSubSubCategoryVisible,
        moveSubCategory,
        moveSubSubCategory,
        addNestedCategory,
        updateNestedCategory,
        deleteNestedCategory,
        toggleNestedCategoryVisible,
      }}
    >
      {children}
    </CategoriesContext.Provider>
  );
};

export const useCategories = () => {
  const ctx = useContext(CategoriesContext);
  if (!ctx) throw new Error('useCategories must be used within CategoriesProvider');
  return ctx;
};
