export default function Loading() {
  return (
    <div className="flex-1 min-h-screen py-16 px-6 relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-b from-[#F5F9FC]/50 via-[#E8F0F7]/30 to-transparent"></div>
      <div className="absolute top-10 left-[10%] w-96 h-96 bg-gradient-to-r from-[#5C9BB8]/10 to-[#FC9770]/10 blur-3xl animate-float-slow opacity-40"></div>

      <div className="max-w-7xl mx-auto relative z-10">
        <div className="text-center mb-12 animate-slide-up">
          <h2 className="text-4xl md:text-6xl font-bold mb-4 text-[#2a2a2a]">
            My <span className="gradient-text-enhanced">Collections</span>
          </h2>
          <p className="text-lg md:text-xl text-[#4a4a4a]/90 max-w-3xl mx-auto leading-relaxed flex items-center justify-center gap-3">
            Preparing your collections
            <span className="loading-dots">
              <span className="dot"></span>
              <span className="dot"></span>
              <span className="dot"></span>
            </span>
          </p>
        </div>

        <div
          className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 animate-slide-up"
          style={{ animationDelay: "200ms" }}
        >
          {Array.from({ length: 12 }).map((_, i) => (
            <div
              key={i}
              className="h-48 bg-gradient-to-br from-[#F5F9FC] via-[#E8F0F7]/60 to-[#D8E4F0]/40 border border-[#5C9BB8]/15 overflow-hidden relative animate-pulse"
              style={{ animationDelay: `${i * 60}ms` }}
            >
              <div className="h-28 bg-gradient-to-br from-[#5C9BB8]/10 to-[#FC9770]/10"></div>
              <div className="p-3 space-y-2">
                <div className="h-4 bg-[#5C9BB8]/20 w-3/4"></div>
                <div className="h-3 bg-[#5C9BB8]/10 w-1/2"></div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}


