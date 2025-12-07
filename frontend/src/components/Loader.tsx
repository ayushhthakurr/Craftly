
export function Loader() {
    return (
      <div role="status" className="fixed inset-0 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center z-50">
        <div className="text-center">
          <div className="relative inline-flex">
            <div className="w-16 h-16 border-4 border-slate-700 border-t-blue-500 rounded-full animate-spin"></div>
            <div className="absolute inset-0 w-16 h-16 border-4 border-transparent border-r-purple-500 rounded-full animate-spin animation-delay-150"></div>
          </div>
          <p className="mt-6 text-white font-semibold text-lg">Generating your website...</p>
          <p className="mt-2 text-slate-400 text-sm">This may take a few moments</p>
        </div>
      </div>
    );
}