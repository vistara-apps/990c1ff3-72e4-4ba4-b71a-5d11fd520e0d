export default function Loading() {
  return (
    <div className="container py-8">
      <div className="animate-pulse space-y-4">
        <div className="h-16 bg-gray-200 rounded-lg"></div>
        <div className="h-32 bg-gray-200 rounded-lg"></div>
        <div className="h-24 bg-gray-200 rounded-lg"></div>
        <div className="space-y-3">
          <div className="h-4 bg-gray-200 rounded w-3/4"></div>
          <div className="h-4 bg-gray-200 rounded w-1/2"></div>
        </div>
      </div>
    </div>
  );
}
