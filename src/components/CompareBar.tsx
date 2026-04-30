'use client';
import { useCompare } from '@/context/CompareContext';
import { useRouter } from 'next/navigation';

export default function CompareBar() {
  const { compareList, removeFromCompare } = useCompare();
  const router = useRouter();

  if (compareList.length === 0) return null;

  return (
    <div className="fixed bottom-0 left-0 right-0 z-40 bg-[#1E3A8A] text-white px-4 py-3 animate-slide-up shadow-modal">
      <div className="container-main flex items-center justify-between gap-4">
        <div className="flex items-center gap-2 flex-1 overflow-x-auto scrollbar-hide">
          <span className="text-sm font-medium whitespace-nowrap">Compare ({compareList.length}/3):</span>
          {compareList.map(c => (
            <span key={c.id} className="inline-flex items-center gap-1 bg-white text-[#1E293B] text-sm font-medium px-3 py-1 rounded-full whitespace-nowrap">
              {c.shortName}
              <button onClick={() => removeFromCompare(c.id)} className="hover:text-[#DC2626] transition-colors">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M18 6 6 18M6 6l12 12"/></svg>
              </button>
            </span>
          ))}
        </div>
        <button onClick={() => router.push('/compare')}
          className="btn-orange !h-[36px] text-sm whitespace-nowrap shrink-0">
          Compare Now
        </button>
      </div>
    </div>
  );
}
