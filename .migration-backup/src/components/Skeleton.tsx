// Skeleton loading — placeholder berdenyut, bukan layar blank.
export function SkeletonLine({ w = 'w-full', className = '' }: { w?: string; className?: string }) {
  return <div className={`h-3.5 rounded-full bg-ink-800 ${w} ${className} animate-pulse`} />;
}

export function SkeletonCard() {
  return (
    <div className="rounded-2xl border border-ink-800/60 bg-ink-900/60 p-5">
      <div className="space-y-3">
        <SkeletonLine w="w-1/3" />
        <SkeletonLine w="w-full" />
        <SkeletonLine w="w-4/5" />
      </div>
    </div>
  );
}

export function SkeletonList({ count = 4 }: { count?: number }) {
  return (
    <div className="space-y-3">
      {Array.from({ length: count }).map((_, i) => (
        <SkeletonCard key={i} />
      ))}
    </div>
  );
}
