import CollegeCardSkeleton from '@/components/CollegeCardSkeleton';

export default function Loading() {
  return (
    <div className="container-main py-6">
      <div className="skeleton h-8 w-64 mb-4" />
      <div className="skeleton h-[48px] w-full mb-6" />
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {Array(12).fill(0).map((_, i) => <CollegeCardSkeleton key={i} />)}
      </div>
    </div>
  );
}
