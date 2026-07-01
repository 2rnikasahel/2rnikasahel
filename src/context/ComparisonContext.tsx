import { createContext, ReactNode, useContext, useState, useEffect } from 'react';

interface ComparisonContextType {
  compareList: number[];
  addToCompare: (id: number) => void;
  removeFromCompare: (id: number) => void;
  isInCompare: (id: number) => boolean;
  toggleCompare: (id: number) => void;
  clearCompare: () => void;
}

const ComparisonContext = createContext<ComparisonContextType | undefined>(undefined);

export const ComparisonProvider = ({ children }: { children: ReactNode }) => {
  const [compareList, setCompareList] = useState<number[]>(() => {
    const saved = localStorage.getItem('compare_list');
    return saved ? JSON.parse(saved) : [];
  });

  useEffect(() => {
    localStorage.setItem('compare_list', JSON.stringify(compareList));
  }, [compareList]);

  const addToCompare = (id: number) => {
    if (!compareList.includes(id) && compareList.length < 4) {
      setCompareList([...compareList, id]);
    }
  };

  const removeFromCompare = (id: number) => {
    setCompareList(compareList.filter(itemId => itemId !== id));
  };

  const isInCompare = (id: number) => compareList.includes(id);

  const toggleCompare = (id: number) => {
    if (isInCompare(id)) {
      removeFromCompare(id);
    } else {
      addToCompare(id);
    }
  };

  const clearCompare = () => setCompareList([]);

  return (
    <ComparisonContext.Provider value={{ compareList, addToCompare, removeFromCompare, isInCompare, toggleCompare, clearCompare }}>
      {children}
    </ComparisonContext.Provider>
  );
};

export const useComparison = () => {
  const context = useContext(ComparisonContext);
  if (!context) {
    throw new Error('useComparison must be used within a ComparisonProvider');
  }
  return context;
};
