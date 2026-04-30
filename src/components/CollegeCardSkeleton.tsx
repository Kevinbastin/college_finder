export default function CollegeCardSkeleton() {
  return (
    <div className="bg-white rounded-lg border border-[#E2E8F0] shadow-card p-4 min-h-[300px] flex flex-col">
      <div className="skeleton h-5 w-3/4 mb-3" />
      <div className="skeleton h-4 w-1/2 mb-2" />
      <div className="skeleton h-4 w-1/3 mb-2" />
      <div className="skeleton h-5 w-2/5 mb-3" />
      <div className="flex gap-2 mb-2">
        <div className="skeleton h-5 w-20" />
        <div className="skeleton h-5 w-16" />
      </div>
      <div className="flex gap-1 mb-3">
        <div className="skeleton h-5 w-14" />
        <div className="skeleton h-5 w-12" />
        <div className="skeleton h-5 w-14" />
      </div>
      <div className="skeleton h-4 w-2/5 mt-auto mb-3" />
      <div className="flex gap-2">
        <div className="skeleton h-[40px] flex-1" />
        <div className="skeleton h-[40px] flex-1" />
      </div>
    </div>
  );
}
