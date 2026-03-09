export function ShimmerEffect({ children, isLoading }) {
  return (
    <div className="relative">
      {children}
      {isLoading && (
        <div className="absolute inset-0 overflow-hidden rounded-lg">
          <div className="shimmer-animation absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/10 to-transparent" />
        </div>
      )}
    </div>
  )
}
