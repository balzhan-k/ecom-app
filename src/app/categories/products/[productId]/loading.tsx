export default function ProductLoading() {
  return (
    <div className="py-8 pb-20">
      <div className="animate-pulse">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div className="relative h-100 bg-gray-200 rounded-lg"></div>

          <div className="space-y-6">
            <div className="h-8 bg-gray-200 rounded w-3/4"></div>

            <div className="space-y-2">
              <div className="h-4 bg-gray-200 rounded w-full"></div>
              <div className="h-4 bg-gray-200 rounded w-5/6"></div>
              <div className="h-4 bg-gray-200 rounded w-4/6"></div>
            </div>

            <div className="flex items-center gap-2">
              <div className="h-8 bg-gray-200 rounded w-24"></div>
              <div className="h-6 bg-gray-200 rounded w-20"></div>
            </div>

            <div className="flex items-center gap-4">
              <div className="flex items-center border border-gray-300 rounded-lg">
                <div className="px-4 py-2 bg-gray-200 rounded-l-lg w-12 h-10"></div>
                <div className="px-4 py-2 text-center min-w-[3rem] text-lg w-12 h-10 bg-gray-200"></div>
                <div className="px-4 py-2 bg-gray-200 rounded-r-lg w-12 h-10"></div>
              </div>
              <div className="px-6 py-2 bg-gray-200 rounded-lg w-32 h-10"></div>
            </div>

            <div className="p-3 bg-gray-100 border border-gray-200 rounded-lg">
              <div className="h-4 bg-gray-200 rounded w-1/3"></div>
            </div>

            <div className="space-y-2">
              <div className="h-4 bg-gray-200 rounded w-1/4"></div>
              <div className="h-4 bg-gray-200 rounded w-1/3"></div>
              <div className="h-4 bg-gray-200 rounded w-1/2"></div>
              <div className="h-4 bg-gray-200 rounded w-2/3"></div>
              <div className="h-4 bg-gray-200 rounded w-1/3"></div>
              <div className="h-4 bg-gray-200 rounded w-1/2"></div>
              <div className="h-4 bg-gray-200 rounded w-3/4"></div>
              <div className="h-4 bg-gray-200 rounded w-1/3"></div>
              <div className="h-4 bg-gray-200 rounded w-1/2"></div>
              <div className="h-4 bg-gray-200 rounded w-2/3"></div>
              <div className="h-4 bg-gray-200 rounded w-1/4"></div>
              <div className="h-4 bg-gray-200 rounded w-1/3"></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
