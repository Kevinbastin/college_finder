'use client';

export default function Error({ error, reset }: { error: Error; reset: () => void }) {
  return (
    <div className="min-h-[70vh] flex items-center justify-center">
      <div className="text-center">
        <div className="text-8xl mb-4">⚠️</div>
        <h1 className="text-3xl font-bold text-[#1E293B] mb-3">Something went wrong</h1>
        <p className="text-base text-[#64748B] mb-6 max-w-md">{error.message || 'An unexpected error occurred. Please try again.'}</p>
        <button onClick={reset} className="btn-primary">Try Again</button>
      </div>
    </div>
  );
}
