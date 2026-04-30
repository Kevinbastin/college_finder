'use client';
import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { College } from '@/types';
import toast from 'react-hot-toast';

interface CompareContextType {
  compareList: College[];
  addToCompare: (college: College) => void;
  removeFromCompare: (id: string) => void;
  clearCompare: () => void;
  isInCompare: (id: string) => boolean;
}

const CompareContext = createContext<CompareContextType | undefined>(undefined);

export function CompareProvider({ children }: { children: ReactNode }) {
  const [compareList, setCompareList] = useState<College[]>([]);

  useEffect(() => {
    const stored = localStorage.getItem('compareList');
    if (stored) {
      try { setCompareList(JSON.parse(stored)); } catch {}
    }
  }, []);

  useEffect(() => {
    localStorage.setItem('compareList', JSON.stringify(compareList));
  }, [compareList]);

  const addToCompare = (college: College) => {
    if (compareList.length >= 3) {
      toast.error('Remove a college to add another', { icon: '⚠️' });
      return;
    }
    if (compareList.find(c => c.id === college.id)) {
      toast.error('Already in compare list');
      return;
    }
    setCompareList(prev => [...prev, college]);
    toast.success(`${college.shortName} added to compare`);
  };

  const removeFromCompare = (id: string) => {
    setCompareList(prev => prev.filter(c => c.id !== id));
  };

  const clearCompare = () => { setCompareList([]); };
  const isInCompare = (id: string) => compareList.some(c => c.id === id);

  return (
    <CompareContext.Provider value={{ compareList, addToCompare, removeFromCompare, clearCompare, isInCompare }}>
      {children}
    </CompareContext.Provider>
  );
}

export function useCompare() {
  const ctx = useContext(CompareContext);
  if (!ctx) throw new Error('useCompare must be used within CompareProvider');
  return ctx;
}
