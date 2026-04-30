'use client';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import CollegeCard from '@/components/CollegeCard';
import CollegeCardSkeleton from '@/components/CollegeCardSkeleton';
import { College } from '@/types';

const quickFilters = ['Engineering', 'Management', 'Government', 'Delhi', 'Mumbai', 'Tamil Nadu'];
const stats = [
  { number: '500+', label: 'Colleges' },
  { number: '20+', label: 'States' },
  { number: '50+', label: 'Courses' },
  { number: '10,000+', label: 'Students Helped' },
];
const steps = [
  { icon: '🔍', title: 'Search', desc: 'Browse colleges by location, fees, and courses' },
  { icon: '⚖️', title: 'Compare', desc: 'Compare up to 3 colleges side by side' },
  { icon: '✅', title: 'Decide', desc: 'Save your favorites and make your choice' },
];

export default function HomePage() {
  const [featured, setFeatured] = useState<College[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const router = useRouter();

  useEffect(() => {
    fetch('/api/colleges/featured').then(r => r.json()).then(d => { setFeatured(d.colleges || []); setLoading(false); }).catch(() => setLoading(false));
  }, []);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (search.trim()) router.push(`/colleges?search=${encodeURIComponent(search.trim())}`);
  };

  const handleQuickFilter = (filter: string) => {
    const isState = ['Delhi', 'Mumbai', 'Tamil Nadu'].includes(filter);
    if (isState) router.push(`/colleges?state=${encodeURIComponent(filter)}`);
    else if (filter === 'Government') router.push('/colleges?type=GOVERNMENT');
    else router.push(`/colleges?courses=${encodeURIComponent(filter === 'Engineering' ? 'B.Tech' : 'MBA')}`);
  };

  return (
    <div>
      {/* Hero */}
      <section className="bg-offwhite py-16 md:py-20">
        <div className="container-main text-center">
          <h1 className="text-4xl md:text-7xl font-bold text-[#1E293B] mb-4">Find Your Perfect College in India</h1>
          <p className="text-base md:text-lg text-[#64748B] mb-8 max-w-2xl mx-auto">
            Search from 500+ colleges. Compare fees, placements, and more.
          </p>
          <form onSubmit={handleSearch} className="max-w-xl mx-auto relative mb-6">
            <svg className="absolute left-4 top-1/2 -translate-y-1/2 text-[#94A3B8]" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.3-4.3"/></svg>
            <input type="text" value={search} onChange={e => setSearch(e.target.value)}
              placeholder="Search colleges, cities, or states..."
              className="input-field !h-[52px] !pl-12 !pr-4 text-base shadow-card !rounded-lg" />
          </form>
          <div className="flex flex-wrap justify-center gap-2">
            {quickFilters.map(f => (
              <button key={f} onClick={() => handleQuickFilter(f)}
                className="px-4 py-2 text-sm font-medium bg-white border border-[#E2E8F0] rounded-full text-[#475569] hover:border-[#2563EB] hover:text-[#2563EB] transition-all duration-200">
                {f}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="bg-white border-y border-[#E2E8F0] py-8">
        <div className="container-main grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
          {stats.map(s => (
            <div key={s.label}>
              <div className="text-3xl md:text-5xl font-bold text-[#2563EB]">{s.number}</div>
              <div className="text-sm text-[#64748B] mt-1">{s.label}</div>
            </div>
          ))}
        </div>
      </section>

      {/* Featured */}
      <section className="py-12">
        <div className="container-main">
          <div className="flex items-center justify-between mb-6">
            <h2 className="section-heading">Top Rated Colleges</h2>
            <Link href="/colleges" className="text-sm font-medium text-[#2563EB] hover:underline no-underline">View All →</Link>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {loading ? Array(6).fill(0).map((_, i) => <CollegeCardSkeleton key={i} />) :
              featured.map(c => <CollegeCard key={c.id} college={c} />)}
          </div>
          <div className="text-center mt-8">
            <Link href="/colleges" className="btn-primary-lg no-underline">Browse All Colleges</Link>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-12 bg-white">
        <div className="container-main">
          <h2 className="section-heading text-center mb-8">How It Works</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {steps.map((s, i) => (
              <div key={i} className="bg-[#EFF6FF] rounded-lg p-6 text-center relative">
                <div className="text-5xl mb-4">{s.icon}</div>
                <h3 className="text-lg font-bold text-[#1E293B] mb-2">{s.title}</h3>
                <p className="text-sm text-[#64748B]">{s.desc}</p>
                {i < 2 && <div className="hidden md:block absolute right-[-20px] top-1/2 -translate-y-1/2 text-[#CBD5E1] text-2xl">→</div>}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="bg-[#1E3A8A] py-12">
        <div className="container-main text-center">
          <h2 className="text-3xl font-bold text-white mb-3">Ready to find your perfect college?</h2>
          <p className="text-sm text-blue-200 mb-6">Join 10,000+ students already using CollegeFind</p>
          <Link href="/colleges" className="btn-orange !text-lg no-underline">Browse All Colleges</Link>
        </div>
      </section>
    </div>
  );
}
