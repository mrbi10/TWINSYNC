import { Skeleton } from './ui/skeleton';
import { Card } from './ui/card';

export function DashboardSkeleton() {
  return (
    <div className="space-y-6">
      {/* Notification Skeleton */}
      <Skeleton className="h-16 w-full rounded-xl" />

      {/* Twin Skeleton */}
      <div className="flex flex-col items-center gap-4">
        <Skeleton className="w-60 h-60 rounded-full" />
        <Skeleton className="h-6 w-32" />
      </div>

      {/* Score Skeleton */}
      <Card className="p-6">
        <div className="flex flex-col items-center gap-4">
          <Skeleton className="h-6 w-40" />
          <Skeleton className="w-32 h-32 rounded-full" />
        </div>
      </Card>

      {/* Quick Actions Skeleton */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Skeleton className="h-24 rounded-xl" />
        <Skeleton className="h-24 rounded-xl" />
        <Skeleton className="h-24 rounded-xl" />
      </div>

      {/* Recent Activity Skeleton */}
      <Card className="p-6">
        <Skeleton className="h-6 w-32 mb-4" />
        <div className="space-y-3">
          {[...Array(4)].map((_, i) => (
            <Skeleton key={i} className="h-16 w-full" />
          ))}
        </div>
      </Card>
    </div>
  );
}

export function AnalyticsSkeleton() {
  return (
    <div className="space-y-6">
      {/* Header Skeleton */}
      <div className="flex items-center justify-between">
        <Skeleton className="h-8 w-48" />
        <div className="flex gap-2">
          <Skeleton className="h-10 w-24" />
          <Skeleton className="h-10 w-24" />
        </div>
      </div>

      {/* Chart Skeleton */}
      <Card className="p-6">
        <Skeleton className="h-6 w-40 mb-4" />
        <Skeleton className="h-80 w-full" />
      </Card>

      {/* Insight Cards Skeleton */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Skeleton className="h-32 rounded-xl" />
        <Skeleton className="h-32 rounded-xl" />
        <Skeleton className="h-32 rounded-xl" />
      </div>
    </div>
  );
}

export function AchievementsSkeleton() {
  return (
    <div className="space-y-6">
      <div>
        <Skeleton className="h-8 w-64 mb-2" />
        <Skeleton className="h-4 w-96" />
      </div>

      {/* Badges Grid Skeleton */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {[...Array(9)].map((_, i) => (
          <Card key={i} className="p-6">
            <div className="flex flex-col items-center gap-4">
              <Skeleton className="w-24 h-24 rounded-full" />
              <Skeleton className="h-6 w-32" />
              <Skeleton className="h-4 w-40" />
              <Skeleton className="h-2 w-full" />
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}
