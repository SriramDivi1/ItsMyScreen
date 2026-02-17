export default function Loading() {
    return (
        <div className="min-h-screen pt-20 sm:pt-24 pb-16 px-4 sm:px-6 flex flex-col items-center animate-fade-in">
            <div className="w-full max-w-2xl">
                {/* Header skeleton */}
                <div className="flex items-center justify-between mb-6">
                    <div className="h-10 w-20 rounded-lg bg-[var(--color-border)] animate-skeleton-pulse" />
                    <div className="h-9 w-24 rounded-xl bg-[var(--color-border)] animate-skeleton-pulse" />
                </div>

                {/* Poll card skeleton */}
                <div className="gradient-border-card p-6 sm:p-8 animate-fade-in-up stagger-1">
                    <div className="mb-6">
                        <div className="h-8 w-3/4 rounded-lg bg-[var(--color-border)] animate-skeleton-pulse mb-3" />
                        <div className="h-6 w-32 rounded-full bg-[var(--color-border)] animate-skeleton-pulse" />
                    </div>

                    <div className="space-y-3 mb-6">
                        {[1, 2, 3, 4].map((i) => (
                            <div key={i} className="rounded-xl p-4 bg-[var(--color-base)] border border-[var(--color-border)]">
                                <div className="flex items-center gap-3">
                                    <div className="w-5 h-5 rounded-full bg-[var(--color-border)] animate-skeleton-pulse flex-shrink-0" />
                                    <div
                                        className="h-5 rounded-lg bg-[var(--color-border)] animate-skeleton-pulse"
                                        style={{ width: `${35 + i * 12}%` }}
                                    />
                                </div>
                            </div>
                        ))}
                    </div>

                    <div className="h-px bg-[var(--color-border)] mb-6" />

                    <div className="flex flex-wrap items-center justify-between gap-3">
                        <div className="h-4 w-32 rounded bg-[var(--color-border)] animate-skeleton-pulse" />
                        <div className="flex gap-2">
                            <div className="h-9 w-12 rounded-xl bg-[var(--color-border)] animate-skeleton-pulse" />
                            <div className="h-9 w-12 rounded-xl bg-[var(--color-border)] animate-skeleton-pulse" />
                            <div className="h-9 w-20 rounded-xl bg-[var(--color-border)] animate-skeleton-pulse" />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
