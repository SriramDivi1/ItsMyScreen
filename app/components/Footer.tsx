import { Zap, Github } from 'lucide-react';

export default function Footer() {
    return (
        <footer className="relative z-10 mt-auto">
            <div className="h-px bg-gradient-to-r from-transparent via-violet-500/20 to-transparent" />
            <div className="max-w-6xl mx-auto px-6 py-8">
                <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
                    <div className="flex items-center gap-2 text-sm text-[var(--color-text-muted)]">
                        <Zap className="w-3.5 h-3.5 text-violet-400" />
                        <span>Built with Next.js & Supabase</span>
                    </div>
                    <div className="flex items-center gap-6 text-sm text-[var(--color-text-muted)]">
                        <a
                            href="https://github.com/SriramDivi1/ItsMyScreen"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-center gap-1.5 hover:text-violet-400 transition-colors duration-300"
                        >
                            <Github className="w-3.5 h-3.5" />
                            <span>GitHub</span>
                        </a>
                        <span className="text-[var(--color-border)]">·</span>
                        <span>© 2026 ItsMyScreen</span>
                    </div>
                </div>
            </div>
        </footer>
    );
}
