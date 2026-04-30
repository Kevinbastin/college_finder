import Link from 'next/link';

export default function NotFound() {
  return (
    <div className="min-h-[70vh] flex items-center justify-center">
      <div className="text-center">
        <div className="text-8xl mb-4">🎓</div>
        <h1 className="text-5xl font-bold text-[#1E293B] mb-3">404</h1>
        <h2 className="text-xl font-semibold text-[#475569] mb-2">Page Not Found</h2>
        <p className="text-base text-[#64748B] mb-6">The page you&apos;re looking for doesn&apos;t exist or has been moved.</p>
        <Link href="/" className="btn-primary no-underline">Go Home</Link>
      </div>
    </div>
  );
}
