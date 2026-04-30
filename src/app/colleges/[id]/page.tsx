'use client';
import { useState, useEffect, use } from 'react';
import { useSession } from 'next-auth/react';
import { useCompare } from '@/context/CompareContext';
import Breadcrumb from '@/components/Breadcrumb';
import CollegeCard from '@/components/CollegeCard';
import CollegeCardSkeleton from '@/components/CollegeCardSkeleton';
import EmptyState from '@/components/EmptyState';
import { College, Question } from '@/types';
import { formatINR, formatLPA, timeAgo } from '@/lib/utils';
import toast from 'react-hot-toast';

export default function CollegeDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const { data: session } = useSession();
  const { addToCompare } = useCompare();
  const [college, setCollege] = useState<College | null>(null);
  const [similar, setSimilar] = useState<College[]>([]);
  const [questions, setQuestions] = useState<Question[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('overview');
  const [isSaved, setIsSaved] = useState(false);
  const [newQuestion, setNewQuestion] = useState('');
  const [answerTexts, setAnswerTexts] = useState<Record<string, string>>({});
  const [expandedQ, setExpandedQ] = useState<string | null>(null);
  const [answers, setAnswers] = useState<Record<string, any[]>>({});

  useEffect(() => {
    Promise.all([
      fetch(`/api/colleges/${id}`).then(r => r.json()),
      fetch(`/api/colleges/similar/${id}`).then(r => r.json()),
      fetch(`/api/questions/${id}`).then(r => r.json()),
    ]).then(([colData, simData, qData]) => {
      setCollege(colData.college);
      setSimilar(simData.colleges || []);
      setQuestions(qData.questions || []);
      setLoading(false);
    }).catch(() => setLoading(false));

    if (session) {
      fetch('/api/saved').then(r => r.json()).then(d => {
        setIsSaved((d.saved || []).some((c: College) => c.id === id));
      });
    }
  }, [id, session]);

  const handleSave = async () => {
    if (!session) { toast.error('Please login to save colleges', { icon: '🔒' }); return; }
    const was = isSaved;
    setIsSaved(!was);
    try {
      if (was) { await fetch(`/api/saved/${id}`, { method: 'DELETE' }); toast.success('Removed from saved'); }
      else { await fetch('/api/saved', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ collegeId: id }) }); toast.success('Saved to your list', { icon: '✓' }); }
    } catch { setIsSaved(was); toast.error('Something went wrong'); }
  };

  const handleAskQuestion = async () => {
    if (!newQuestion.trim() || newQuestion.length < 10) { toast.error('Question must be at least 10 characters'); return; }
    try {
      const res = await fetch('/api/questions', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ collegeId: id, text: newQuestion }) });
      const data = await res.json();
      if (res.ok) { setQuestions(prev => [data.question, ...prev]); setNewQuestion(''); toast.success('Question submitted!'); }
    } catch { toast.error('Failed to post question'); }
  };

  const handleAnswer = async (questionId: string) => {
    const text = answerTexts[questionId];
    if (!text || text.length < 5) { toast.error('Answer must be at least 5 characters'); return; }
    try {
      const res = await fetch('/api/answers', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ questionId, text }) });
      if (res.ok) {
        const data = await res.json();
        setAnswers(prev => ({ ...prev, [questionId]: [data.answer, ...(prev[questionId] || [])] }));
        setAnswerTexts(prev => ({ ...prev, [questionId]: '' }));
        toast.success('Answer posted!');
      }
    } catch { toast.error('Failed to post answer'); }
  };

  const loadAnswers = async (questionId: string) => {
    if (expandedQ === questionId) { setExpandedQ(null); return; }
    setExpandedQ(questionId);
    if (!answers[questionId]) {
      const res = await fetch(`/api/answers/${questionId}`);
      const data = await res.json();
      setAnswers(prev => ({ ...prev, [questionId]: data.answers || [] }));
    }
  };

  if (loading) return (
    <div>
      <div className="bg-[#1E3A8A] py-12"><div className="container-main"><div className="skeleton h-8 w-1/2 mb-3 !bg-blue-700/30" /><div className="skeleton h-5 w-1/3 !bg-blue-700/30" /></div></div>
      <div className="container-main py-6 grid grid-cols-1 md:grid-cols-4 gap-4">{[1,2,3,4].map(i=><div key={i} className="skeleton h-20" />)}</div>
    </div>
  );

  if (!college) return <EmptyState icon="🏫" title="College not found" description="This college doesn't exist or was removed" actionLabel="Browse Colleges" actionHref="/colleges" />;

  const tabs = ['overview', 'courses', 'placements', 'contact'];

  return (
    <div>
      {/* Hero Banner */}
      <section className="bg-[#1E3A8A] py-10 md:py-12">
        <div className="container-main">
          <Breadcrumb items={[{ label: 'Home', href: '/' }, { label: 'Colleges', href: '/colleges' }, { label: college.shortName }]} />
          <h1 className="text-3xl md:text-6xl font-bold text-white mb-2">{college.name}</h1>
          <div className="flex items-center gap-2 text-blue-200 text-sm mb-3">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/></svg>
            {college.city}, {college.state}
          </div>
          <div className="flex items-center gap-3 mb-4 flex-wrap">
            <div className="flex items-center gap-1">
              {[1,2,3,4,5].map(i => <svg key={i} width="16" height="16" viewBox="0 0 24 24" fill={i <= Math.round(college.rating) ? '#F97316' : '#475569'} stroke={i <= Math.round(college.rating) ? '#F97316' : '#475569'} strokeWidth="1"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>)}
              <span className="text-white text-sm font-bold ml-1">{college.rating}</span>
              <span className="text-blue-200 text-xs">({college.reviewCount} reviews)</span>
            </div>
            {college.type === 'GOVERNMENT' ? <span className="badge-green">Government</span> : <span className="badge-red">Private</span>}
            <span className="badge-blue">{college.naacGrade} NAAC</span>
          </div>
          <div className="flex gap-3 flex-wrap">
            <button onClick={handleSave} className="px-4 h-[40px] border-2 border-white text-white rounded font-semibold text-sm hover:bg-white/10 transition-all inline-flex items-center gap-2">
              {isSaved ? '★ Saved' : '☆ Save College'}
            </button>
            <button onClick={() => addToCompare(college)} className="btn-orange !h-[40px] text-sm">⚖ Compare</button>
          </div>
        </div>
      </section>

      {/* Quick Stats */}
      <section className="bg-white border-b border-[#E2E8F0] py-6">
        <div className="container-main grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
          {[
            { label: 'Annual Fees', value: formatINR(college.annualFees) },
            { label: 'Placement Rate', value: `${college.placementPct}%` },
            { label: 'Avg Package', value: formatLPA(college.avgPackage) },
            { label: 'Total Students', value: college.totalStudents.toLocaleString() },
          ].map(s => (
            <div key={s.label}>
              <div className="text-xl md:text-3xl font-bold text-[#1E3A8A]">{s.value}</div>
              <div className="text-xs text-[#64748B] mt-1">{s.label}</div>
            </div>
          ))}
        </div>
      </section>

      {/* Tabs */}
      <section className="container-main py-6">
        <div className="flex border-b border-[#E2E8F0] mb-6 overflow-x-auto scrollbar-hide">
          {tabs.map(t => (
            <button key={t} onClick={() => setActiveTab(t)}
              className={`px-5 py-3 text-sm font-medium capitalize whitespace-nowrap transition-colors ${
                activeTab === t ? 'text-[#2563EB] border-b-2 border-[#2563EB]' : 'text-[#64748B] hover:text-[#1E293B]'
              }`}>{t}</button>
          ))}
        </div>

        {/* Tab Content */}
        {activeTab === 'overview' && (
          <div>
            <h2 className="text-2xl font-bold text-[#1E293B] mb-4">About {college.shortName}</h2>
            <p className="text-body mb-6">{college.about}</p>
            <div className="grid grid-cols-2 gap-4 mb-6">
              <div className="bg-[#F8FAFC] p-4 rounded-lg"><span className="text-xs text-[#64748B]">Established</span><div className="font-bold text-[#1E293B]">{college.establishedYear}</div></div>
              <div className="bg-[#F8FAFC] p-4 rounded-lg"><span className="text-xs text-[#64748B]">Type</span><div className="font-bold text-[#1E293B]">{college.type}</div></div>
            </div>
          </div>
        )}

        {activeTab === 'courses' && (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead><tr className="bg-[#1E3A8A] text-white">
                <th className="text-left p-3 font-bold text-xs">Course Name</th>
                <th className="text-left p-3 font-bold text-xs">Duration</th>
                <th className="text-left p-3 font-bold text-xs">Fees</th>
              </tr></thead>
              <tbody>
                {college.courses.map((c, i) => (
                  <tr key={c} className={i % 2 === 0 ? 'bg-white' : 'bg-[#F8FAFC]'}>
                    <td className="p-3 font-medium text-[#1E293B]">{c}</td>
                    <td className="p-3 text-[#64748B]">{c.includes('PhD') ? '3-5 years' : c.includes('M.') ? '2 years' : '4 years'}</td>
                    <td className="p-3 text-[#1E3A8A] font-bold">{formatINR(college.annualFees)}/yr</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {activeTab === 'placements' && (
          <div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
              <div className="bg-[#F0FDF4] p-6 rounded-lg text-center"><div className="text-3xl font-bold text-[#16A34A]">{college.placementPct}%</div><div className="text-sm text-[#64748B] mt-1">Placement Rate</div></div>
              <div className="bg-[#EFF6FF] p-6 rounded-lg text-center"><div className="text-3xl font-bold text-[#2563EB]">{formatLPA(college.avgPackage)}</div><div className="text-sm text-[#64748B] mt-1">Average Package</div></div>
              <div className="bg-[#FEF9C3] p-6 rounded-lg text-center"><div className="text-3xl font-bold text-[#EAB308]">{formatLPA(college.highestPackage)}</div><div className="text-sm text-[#64748B] mt-1">Highest Package</div></div>
            </div>
            <h3 className="font-bold text-lg text-[#1E293B] mb-3">Top Recruiters</h3>
            <div className="flex flex-wrap gap-2">
              {college.topRecruiters.map(r => <span key={r} className="bg-[#F1F5F9] text-[#475569] px-3 py-1 rounded text-sm font-medium">{r}</span>)}
            </div>
          </div>
        )}

        {activeTab === 'contact' && (
          <div className="space-y-4">
            {[
              { icon: '🌐', label: 'Website', value: college.website },
              { icon: '📞', label: 'Phone', value: college.phone },
              { icon: '✉️', label: 'Email', value: college.email },
              { icon: '📍', label: 'Address', value: `${college.city}, ${college.state}` },
            ].map(c => (
              <div key={c.label} className="flex items-start gap-3 p-4 bg-[#F8FAFC] rounded-lg">
                <span className="text-xl">{c.icon}</span>
                <div><div className="text-xs text-[#64748B]">{c.label}</div><div className="text-sm font-medium text-[#1E293B]">{c.value}</div></div>
              </div>
            ))}
          </div>
        )}
      </section>

      {/* Similar Colleges */}
      <section className="container-main py-6">
        <h2 className="section-heading mb-6">You Might Also Like</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {similar.length > 0 ? similar.map(c => <CollegeCard key={c.id} college={c} />) :
            [1,2,3].map(i => <CollegeCardSkeleton key={i} />)}
        </div>
      </section>

      {/* Q&A Section */}
      <section className="container-main py-6 mb-8">
        <div className="flex items-center gap-3 mb-6">
          <h2 className="section-heading">Questions & Answers</h2>
          <span className="bg-[#E2E8F0] text-[#475569] text-xs font-bold px-2 py-0.5 rounded-full">{questions.length}</span>
        </div>

        {session ? (
          <div className="mb-6 bg-white p-4 rounded-lg border border-[#E2E8F0]">
            <textarea value={newQuestion} onChange={e => setNewQuestion(e.target.value)}
              placeholder="Ask a question about this college (min 10 chars)..."
              className="input-field !h-auto min-h-[80px] resize-none mb-3" />
            <button onClick={handleAskQuestion} className="btn-primary text-sm">Ask Question</button>
          </div>
        ) : (
          <div className="mb-6 p-4 bg-[#FEF9C3] rounded-lg text-sm text-[#92400E]">🔒 Login to ask or answer questions</div>
        )}

        {questions.length === 0 ? (
          <EmptyState icon="💬" title="No questions yet" description="Be the first to ask a question!" />
        ) : (
          <div className="space-y-3">
            {questions.map(q => (
              <div key={q.id} className="bg-white rounded-lg border border-[#E2E8F0] p-4">
                <button onClick={() => loadAnswers(q.id)} className="w-full text-left">
                  <div className="font-medium text-[#1E293B] text-sm mb-1">{q.text}</div>
                  <div className="flex items-center gap-3 text-xs text-[#94A3B8]">
                    <span>{q.user?.name || 'Anonymous'}</span>
                    <span>{timeAgo(q.createdAt)}</span>
                    <span>{q._count?.answers || 0} answers</span>
                  </div>
                </button>
                {expandedQ === q.id && (
                  <div className="mt-4 pl-4 border-l-2 border-[#E2E8F0]">
                    {(answers[q.id] || []).map((a: any) => (
                      <div key={a.id} className="mb-3">
                        <p className="text-sm text-[#475569]">{a.text}</p>
                        <div className="text-xs text-[#94A3B8] mt-1">{a.user?.name} · {timeAgo(a.createdAt)}</div>
                      </div>
                    ))}
                    {session && (
                      <div className="flex gap-2 mt-3">
                        <input value={answerTexts[q.id] || ''} onChange={e => setAnswerTexts(prev => ({ ...prev, [q.id]: e.target.value }))}
                          placeholder="Write an answer..." className="input-field !h-[36px] text-sm flex-1" />
                        <button onClick={() => handleAnswer(q.id)} className="btn-primary text-sm !h-[36px]">Reply</button>
                      </div>
                    )}
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
