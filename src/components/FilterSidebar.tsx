'use client';
import { useState } from 'react';

interface FilterValues {
  state: string;
  type: string;
  minFees: string;
  maxFees: string;
  naac: string[];
  minRating: string;
  courses: string[];
}

interface Props {
  values: FilterValues;
  onChange: (values: FilterValues) => void;
  onClear: () => void;
  states: string[];
}

const NAAC_GRADES = ['A++', 'A+', 'A', 'B++', 'B+'];
const COURSE_OPTIONS = ['B.Tech', 'MBA', 'MBBS', 'BBA', 'B.Sc', 'LLB'];
const RATING_OPTIONS = [
  { label: '4+ Stars', value: '4' },
  { label: '3.5+ Stars', value: '3.5' },
  { label: '3+ Stars', value: '3' },
];

export default function FilterSidebar({ values, onChange, onClear, states }: Props) {
  const [openSections, setOpenSections] = useState<Record<string, boolean>>({
    state: true, type: true, fees: true, naac: true, rating: true, courses: true,
  });

  const activeCount = [
    values.state, values.type, values.minFees, values.maxFees,
    values.naac.length > 0 ? 'x' : '', values.minRating,
    values.courses.length > 0 ? 'x' : '',
  ].filter(Boolean).length;

  const toggleSection = (key: string) => {
    setOpenSections(prev => ({ ...prev, [key]: !prev[key] }));
  };

  const update = (partial: Partial<FilterValues>) => {
    onChange({ ...values, ...partial });
  };

  const toggleArray = (arr: string[], value: string) =>
    arr.includes(value) ? arr.filter(v => v !== value) : [...arr, value];

  const Section = ({ id, title, children }: { id: string; title: string; children: React.ReactNode }) => (
    <div className="border-b border-[#E2E8F0] py-3">
      <button onClick={() => toggleSection(id)} className="flex items-center justify-between w-full text-sm font-semibold text-[#1E293B]">
        {title}
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"
          className={`transition-transform ${openSections[id] ? 'rotate-180' : ''}`}>
          <path d="m6 9 6 6 6-6"/>
        </svg>
      </button>
      {openSections[id] && <div className="mt-3">{children}</div>}
    </div>
  );

  return (
    <div className="bg-white rounded-lg border border-[#E2E8F0] p-4">
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#1E293B" strokeWidth="2"><polygon points="22 3 2 3 10 12.46 10 19 14 21 14 12.46 22 3"/></svg>
          <span className="font-bold text-sm text-[#1E293B]">Filters</span>
          {activeCount > 0 && (
            <span className="bg-[#2563EB] text-white text-xs font-bold w-5 h-5 rounded-full flex items-center justify-center">{activeCount}</span>
          )}
        </div>
      </div>

      <Section id="state" title="State / Location">
        <select value={values.state} onChange={e => update({ state: e.target.value })}
          className="input-field !h-[36px] text-sm">
          <option value="">All States</option>
          {states.map(s => <option key={s} value={s}>{s}</option>)}
        </select>
      </Section>

      <Section id="type" title="College Type">
        {['GOVERNMENT', 'PRIVATE'].map(t => (
          <label key={t} className="flex items-center gap-2 text-sm text-[#475569] mb-1 cursor-pointer">
            <input type="checkbox" checked={values.type === t} onChange={() => update({ type: values.type === t ? '' : t })}
              className="w-4 h-4 accent-[#2563EB]" />
            {t === 'GOVERNMENT' ? 'Government' : 'Private'}
          </label>
        ))}
      </Section>

      <Section id="fees" title="Fees Range">
        <div className="flex gap-2">
          <input type="number" placeholder="Min ₹" value={values.minFees} onChange={e => update({ minFees: e.target.value })}
            className="input-field !h-[36px] text-sm flex-1" />
          <input type="number" placeholder="Max ₹" value={values.maxFees} onChange={e => update({ maxFees: e.target.value })}
            className="input-field !h-[36px] text-sm flex-1" />
        </div>
      </Section>

      <Section id="naac" title="NAAC Grade">
        {NAAC_GRADES.map(g => (
          <label key={g} className="flex items-center gap-2 text-sm text-[#475569] mb-1 cursor-pointer">
            <input type="checkbox" checked={values.naac.includes(g)} onChange={() => update({ naac: toggleArray(values.naac, g) })}
              className="w-4 h-4 accent-[#2563EB]" />
            {g}
          </label>
        ))}
      </Section>

      <Section id="rating" title="Rating">
        {RATING_OPTIONS.map(r => (
          <label key={r.value} className="flex items-center gap-2 text-sm text-[#475569] mb-1 cursor-pointer">
            <input type="radio" name="rating" checked={values.minRating === r.value}
              onChange={() => update({ minRating: values.minRating === r.value ? '' : r.value })}
              className="w-4 h-4 accent-[#2563EB]" />
            {r.label}
          </label>
        ))}
      </Section>

      <Section id="courses" title="Courses Offered">
        {COURSE_OPTIONS.map(c => (
          <label key={c} className="flex items-center gap-2 text-sm text-[#475569] mb-1 cursor-pointer">
            <input type="checkbox" checked={values.courses.includes(c)} onChange={() => update({ courses: toggleArray(values.courses, c) })}
              className="w-4 h-4 accent-[#2563EB]" />
            {c}
          </label>
        ))}
      </Section>

      <button onClick={onClear} className="btn-danger text-sm mt-3 w-full text-center">Clear All Filters</button>
    </div>
  );
}
