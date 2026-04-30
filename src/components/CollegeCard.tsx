'use client';
import Link from 'next/link';
import { College } from '@/types';
import { formatINR } from '@/lib/utils';
import { useSession } from 'next-auth/react';
import { useCompare } from '@/context/CompareContext';
import { useState } from 'react';
import toast from 'react-hot-toast';

interface Props {
  college: College;
  savedIds?: string[];
  onToggleSave?: (id: string, saved: boolean) => void;
  showChance?: string;
}

export default function CollegeCard({ college, savedIds = [], onToggleSave, showChance }: Props) {
  const { data: session } = useSession();
  const { addToCompare, isInCompare } = useCompare();
  const [isSaved, setIsSaved] = useState(savedIds.includes(college.id));
  const [bookmarkAnim, setBookmarkAnim] = useState(false);

  const handleSave = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (!session) {
      toast.error('Please login to save colleges', { icon: '🔒' });
      return;
    }
    const wasSaved = isSaved;
    setIsSaved(!wasSaved);
    setBookmarkAnim(true);
    setTimeout(() => setBookmarkAnim(false), 300);

    try {
      if (wasSaved) {
        await (await import('@/lib/api')).apiFetch(`/api/saved/${college.id}`, { method: 'DELETE' });
        toast.success('Removed from saved');
      } else {
        await (await import('@/lib/api')).apiFetch('/api/saved', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ collegeId: college.id }) });
        toast.success('Saved to your list', { icon: '✓' });
      }
      onToggleSave?.(college.id, !wasSaved);
    } catch {
      setIsSaved(wasSaved);
      toast.error('Something went wrong. Please try again.');
    }
  };

  const handleCompare = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    addToCompare(college);
  };

  const typeBadge = college.type === 'GOVERNMENT'
    ? <span className="badge-green">Government</span>
    : <span className="badge-red">Private</span>;

  const coursesShown = college.courses.slice(0, 3);
  const moreCount = college.courses.length - 3;

  return (
    <div className="card relative flex flex-col p-4 min-h-[300px]">
      {/* Bookmark */}
      <button onClick={handleSave}
        className={`absolute top-3 right-3 z-10 transition-transform duration-200 ${bookmarkAnim ? 'scale-130' : 'scale-100'}`}
        title={isSaved ? 'Remove from saved' : 'Save college'}>
        {isSaved ? (
          <svg width="22" height="22" viewBox="0 0 24 24" fill="#1E3A8A" stroke="#1E3A8A" strokeWidth="2"><path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z"/></svg>
        ) : (
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#64748B" strokeWidth="2"><path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z"/></svg>
        )}
      </button>

      {/* Chance Badge */}
      {showChance && (
        <div className={`absolute top-3 left-3 z-10 ${
          showChance === 'HIGH' ? 'badge-green' : showChance === 'MODERATE' ? 'badge-yellow' : 'badge-red'
        }`}>
          {showChance === 'HIGH' ? '🟢 High Chance' : showChance === 'MODERATE' ? '🟡 Moderate Chance' : '🔴 Low Chance'}
        </div>
      )}

      {/* Content */}
      <Link href={`/colleges/${college.id}`} className="no-underline flex-1 flex flex-col">
        <h3 className="text-lg font-bold text-[#1E293B] hover:text-[#2563EB] transition-colors line-clamp-2 pr-8 mb-2">
          {college.name}
        </h3>

        <div className="flex items-center gap-1 text-sm text-[#64748B] mb-2">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/></svg>
          {college.city}, {college.state}
        </div>

        <div className="flex items-center gap-1 mb-2">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="#F97316" stroke="#F97316" strokeWidth="1"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>
          <span className="text-sm font-bold text-[#F97316]">{college.rating}</span>
          <span className="text-xs text-[#94A3B8]">({college.reviewCount} reviews)</span>
        </div>

        <div className="text-md font-bold text-[#1E3A8A] mb-2">
          {formatINR(college.annualFees)} / year
        </div>

        <div className="flex flex-wrap gap-1 mb-2">
          {typeBadge}
          <span className="badge-blue">{college.naacGrade} NAAC</span>
        </div>

        <div className="flex flex-wrap gap-1 mb-2">
          {coursesShown.map(c => (
            <span key={c} className="text-xs bg-[#F1F5F9] text-[#475569] px-2 py-0.5 rounded">{c}</span>
          ))}
          {moreCount > 0 && <span className="text-xs text-[#94A3B8]">+{moreCount} more</span>}
        </div>

        <div className="flex items-center gap-1 text-sm text-[#64748B] mt-auto mb-3">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="2" y="7" width="20" height="14" rx="2"/><path d="M16 7V5a4 4 0 0 0-8 0v2"/></svg>
          {college.placementPct}% placement rate
        </div>
      </Link>

      {/* Actions */}
      <div className="flex gap-2 mt-auto">
        <Link href={`/colleges/${college.id}`} className="btn-primary flex-1 text-sm no-underline text-center">View Details</Link>
        <button onClick={handleCompare}
          className={`flex-1 text-sm rounded h-[40px] font-semibold transition-all duration-200 ${
            isInCompare(college.id) ? 'bg-[#2563EB] text-white' : 'border-2 border-[#2563EB] text-[#2563EB] hover:bg-[#2563EB] hover:text-white'
          }`}>
          {isInCompare(college.id) ? '✓ Compared' : 'Compare'}
        </button>
      </div>
    </div>
  );
}
