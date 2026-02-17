import { Zap } from 'lucide-react';

export default function Footer() {
    return (
        <footer className="relative border-t border-neutral-800/50 py-8 mt-auto">
            <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
                    <div className="flex items-center gap-2 text-neutral-500 text-sm">
                        <Zap className="w-4 h-4 text-indigo-500/60" />
                        <span>
                            Built with{' '}
                            <span className="text-red-400">♥</span>{' '}
                            using Next.js & Supabase
                        </span>
                    </div>

                    <div className="flex items-center gap-6 text-sm text-neutral-500">
                        <a
                            href="https://github.com/sriramnaidu/poll-app"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="hover:text-white transition-colors"
                        >
                            GitHub
                        </a>
                        <span className="text-neutral-700">•</span>
                        <span>© {new Date().getFullYear()} ItsMyScreen</span>
                    </div>
                </div>
            </div>
        </footer>
    );
}
