const StockMovementListSkeleton = () => (
  <div className="animate-pulse">
    <div className="hidden md:grid md:grid-cols-12 gap-4 p-4 mb-2">
      {[...Array(6)].map((_, i) => (
        <div
          key={i}
          className="h-4 bg-neutral-200 dark:bg-neutral-700 rounded col-span-2"
        ></div>
      ))}
    </div>
    <div className="space-y-4 md:space-y-0">
      {[...Array(5)].map((_, i) => (
        <div
          key={i}
          className="p-4 bg-neutral-100 dark:bg-neutral-800/50 rounded-lg md:grid md:grid-cols-12 items-center gap-4"
        >
          <div className="col-span-3 h-5 w-24 bg-neutral-300 dark:bg-neutral-600 rounded"></div>
          <div className="col-span-2 h-5 w-16 bg-neutral-300 dark:bg-neutral-600 rounded mt-2 md:mt-0"></div>
          <div className="col-span-2 h-5 w-24 bg-neutral-300 dark:bg-neutral-600 rounded mt-2 md:mt-0"></div>
          <div className="col-span-2 h-5 w-24 bg-neutral-300 dark:bg-neutral-600 rounded mt-2 md:mt-0"></div>
          <div className="col-span-2 h-5 w-24 bg-neutral-300 dark:bg-neutral-600 rounded mt-2 md:mt-0"></div>
          <div className="col-span-1 flex justify-end items-center gap-2 mt-2 md:mt-0">
            <div className="w-8 h-8 bg-neutral-300 dark:bg-neutral-600 rounded-md"></div>
          </div>
        </div>
      ))}
    </div>
  </div>
);

export default StockMovementListSkeleton;
