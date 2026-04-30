import Link from 'next/link';

interface BreadcrumbItem { label: string; href?: string; }

export default function Breadcrumb({ items }: { items: BreadcrumbItem[] }) {
  return (
    <nav className="flex items-center gap-2 text-xs text-[#64748B] mb-4">
      {items.map((item, i) => (
        <span key={i} className="flex items-center gap-2">
          {i > 0 && <span className="text-[#CBD5E1]">&gt;</span>}
          {item.href ? (
            <Link href={item.href} className="hover:text-[#2563EB] transition-colors no-underline">{item.label}</Link>
          ) : (
            <span className="text-[#1E293B] font-medium">{item.label}</span>
          )}
        </span>
      ))}
    </nav>
  );
}
