export default function CategoryLoading() {
  return (
    <div className="py-8">
      <div className="animate-pulse">

        {/* Сетка товаров */}
        <div className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 pb-20">
          {/* Генерируем 8 карточек товаров для skeleton */}
          {Array.from({ length: 8 }).map((_, index) => (
            <div key={index} className="bg-white rounded-lg shadow-md">
              {/* Картинка товара */}
              <div className="relative h-48 w-full bg-gray-200 rounded-t-lg"></div>

              {/* Информация о товаре */}
              <div className="p-4 space-y-3">
                {/* Название товара */}
                <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                <div className="h-4 bg-gray-200 rounded w-1/2"></div>

                {/* Цена */}
                <div className="flex items-center gap-2">
                  <div className="h-6 bg-gray-200 rounded w-16"></div>
                  <div className="h-4 bg-gray-200 rounded w-12"></div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
