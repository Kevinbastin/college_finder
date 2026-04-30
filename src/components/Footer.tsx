import Link from 'next/link';

export default function Footer() {
  return (
    <footer className="bg-[#0F172A] text-white mt-12">
      <div className="container-main py-10">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Logo & Tagline */}
          <div>
            <Link href="/" className="flex items-center gap-2 text-white font-bold text-xl no-underline mb-3">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M22 10v6M2 10l10-5 10 5-10 5z"/><path d="M6 12v5c0 1.1 2.7 3 6 3s6-1.9 6-3v-5"/>
              </svg>
              CollegeFind
            </Link>
            <p className="text-sm text-gray-400">Helping students find their perfect college</p>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="font-bold text-sm mb-3 text-gray-300">Quick Links</h3>
            <div className="flex flex-col gap-2">
              {[['/', 'Home'], ['/colleges', 'Colleges'], ['/compare', 'Compare'], ['/predictor', 'Predictor']].map(([href, label]) => (
                <Link key={href} href={href} className="text-sm text-gray-400 hover:text-white transition-colors no-underline">{label}</Link>
              ))}
            </div>
          </div>

          {/* Info */}
          <div>
            <h3 className="font-bold text-sm mb-3 text-gray-300">About</h3>
            <p className="text-sm text-gray-400">Built for students across India. Compare colleges, check placements, and make informed decisions.</p>
          </div>
        </div>

        <div className="border-t border-gray-700 mt-8 pt-6 text-center text-xs text-gray-500">
          © 2024 CollegeFind. All rights reserved.
        </div>
      </div>
    </footer>
  );
}
