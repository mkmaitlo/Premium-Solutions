export default function Loading() {
    return (
      <div className="w-full h-[70vh] flex justify-center items-center">
        <div className="flex flex-col items-center gap-4">
          <div className="relative w-16 h-16">
            <div className="absolute inset-0 border-4 border-primary-500/20 rounded-full"></div>
            <div className="absolute inset-0 border-4 border-transparent border-t-primary-500 rounded-full animate-spin"></div>
          </div>
          <p className="text-gray-500 text-sm animate-pulse">Loading...</p>
        </div>
      </div>
    )
  }
