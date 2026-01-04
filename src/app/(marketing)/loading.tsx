import { Skeleton } from '@/shared/ui';

export default function MarketingLoading() {
  return (
    <div className="min-h-screen bg-white">
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          <Skeleton className="h-12 w-3/4 mb-8" />
          <Skeleton lines={3} className="mb-6" />
          <Skeleton className="h-64 w-full mb-6" />
          <Skeleton lines={2} className="mb-4" />
          <Skeleton className="h-12 w-48" />
        </div>
      </div>
    </div>
  );
}
