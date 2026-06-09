export default function SkeletonCard({ count = 3 }: { count?: number }) {
  return (
    <div className="skeleton-grid">
      {Array.from({ length: count }).map((_, i) => (
        <div key={i} className="card skeleton-card">
          <div className="skeleton skeleton-icon" />
          <div className="skeleton skeleton-title" />
          <div className="skeleton skeleton-line" />
          <div className="skeleton skeleton-line-short" />
          <div className="skeleton-badges">
            <div className="skeleton skeleton-badge" />
            <div className="skeleton skeleton-badge" />
          </div>
        </div>
      ))}
    </div>
  );
}
