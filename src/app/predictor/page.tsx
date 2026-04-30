'use client';
import { useState } from 'react';
import CollegeCard from '@/components/CollegeCard';
import CollegeCardSkeleton from '@/components/CollegeCardSkeleton';
import EmptyState from '@/components/EmptyState';
import Breadcrumb from '@/components/Breadcrumb';
import { CollegeWithChance, ExamType } from '@/types';

const EXAMS: { value: ExamType; label: string }[] = [
  { value: 'JEE_MAIN', label: 'JEE Main' },
  { value: 'JEE_ADVANCED', label: 'JEE Advanced' },
  { value: 'NEET', label: 'NEET' },
  { value: 'CAT', label: 'CAT' },
  { value: 'GATE', label: 'GATE' },
];

export default function PredictorPage() {
  const [exam, setExam] = useState<ExamType | ''>('');
  const [rank, setRank] = useState('');
  const [results, setResults] = useState<CollegeWithChance[]>([]);
  const [loading, setLoading] = useState(false);
  const [searched, setSearched] = useState(false);

  const handlePredict = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!exam || !rank) return;
    setLoading(true);
    setSearched(true);
    try {
      const res = await fetch(`/api/predict?exam=${exam}&rank=${rank}`);
      const data = await res.json();
      setResults(data.colleges || []);
    } catch { setResults([]); }
    setLoading(false);
  };

  return (
    <div className="container-main py-6">
      <Breadcrumb items={[{ label: 'Home', href: '/' }, { label: 'Predictor' }]} />
      <div className="text-center mb-8">
        <h1 className="text-3xl md:text-4xl font-bold text-[#1E293B] mb-2">🎯 College Predictor</h1>
        <p className="text-base text-[#64748B]">Enter your exam and rank to see matching colleges</p>
      </div>

      <form onSubmit={handlePredict} className="bg-white rounded-lg shadow-card p-6 max-w-[500px] mx-auto mb-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
          <div>
            <label className="text-xs font-bold text-[#475569] mb-1 block">Select Exam</label>
            <select value={exam} onChange={e => setExam(e.target.value as ExamType)}
              className="input-field">
              <option value="">Choose exam...</option>
              {EXAMS.map(e => <option key={e.value} value={e.value}>{e.label}</option>)}
            </select>
          </div>
          <div>
            <label className="text-xs font-bold text-[#475569] mb-1 block">Your Rank / Percentile</label>
            <input type="number" value={rank} onChange={e => setRank(e.target.value)}
              placeholder="e.g., 15000" className="input-field" />
          </div>
        </div>
        <button type="submit" disabled={!exam || !rank || loading} className="btn-primary w-full !h-[48px]">
          {loading ? <span className="animate-spin">⟳</span> : 'Predict My Colleges'}
        </button>
      </form>

      {!searched && (
        <EmptyState icon="📊" title="Enter your details above" description="Select an exam and enter your rank to see which colleges match" />
      )}

      {searched && !loading && results.length === 0 && (
        <EmptyState icon="😕" title="No colleges found" description="No colleges found for this rank. Try a different exam or higher rank." />
      )}

      {searched && !loading && results.length > 0 && (
        <>
          <p className="text-sm text-[#64748B] mb-4 text-center">Found {results.length} colleges matching your rank</p>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {results.map(c => <CollegeCard key={c.id} college={c} showChance={c.chance} />)}
          </div>
        </>
      )}

      {loading && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {Array(6).fill(0).map((_, i) => <CollegeCardSkeleton key={i} />)}
        </div>
      )}
    </div>
  );
}
