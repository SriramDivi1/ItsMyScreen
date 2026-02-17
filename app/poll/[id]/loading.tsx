
export default function Loading() {
    return (
        <div className="min-h-screen p-4 sm:p-8 flex flex-col items-center">
            <div className="w-full max-w-2xl">
                {/* Header skeleton */}
                <div className="flex items-center justify-between mb-6 animate-fade-in">
                    <div className="w-16 h-5 rounded-lg bg-white/5" />
                    <div className="w-24 h-9 rounded-xl bg-white/5" />
                </div>

                {/* Poll card skeleton */}
                <div className="gradient-border-card p-6 sm:p-8 animate-fade-in-up">
                    {/* Question */}
                    <div className="mb-6">
                        <div className="h-8 w-3/4 rounded-lg bg-white/5 mb-3" />
                        <div className="h-5 w-32 rounded-full bg-white/5" />
                    </div>

                    {/* Options */}
                    <div className="space-y-3 mb-6">
                        {[1, 2, 3].map(i => (
                            <div key={i} className="rounded-xl p-4 bg-white/[0.03] border border-transparent">
                                <div className="flex items-center gap-3">
                                    <div className="w-5 h-5 rounded-full bg-white/5" />
                                    <div className="h-5 rounded-lg bg-white/5" style={{ width: `${40 + i * 15}%` }} />
                                </div>
                            </div>
                        ))}
                    </div>

                    <div className="h-px bg-gradient-to-r from-transparent via-white/5 to-transparent mb-5" />

                    <div className="flex items-center justify-between">
                        <div className="w-48 h-4 rounded bg-white/5" />
                        <div className="w-28 h-9 rounded-xl bg-white/5" />
                    </div>
                </div>
            </div>
        </div>
    );
}
