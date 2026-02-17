'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Zap, Plus } from 'lucide-react';

export default function Navbar() {
    const pathname = usePathname();
    const isCreatePage = pathname === '/create';

    return (
        <nav className="fixed top-0 left-0 right-0 z-50 glass border-b border-neutral-800/50">
            <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex items-center justify-between h-16">
                    {/* Logo */}
                    <Link href="/" className="flex items-center gap-2 group">
                        <div className="relative flex items-center justify-center w-9 h-9 rounded-xl bg-indigo-600/20 border border-indigo-500/30 group-hover:border-indigo-400/50 transition-colors">
                            <Zap className="w-5 h-5 text-indigo-400" />
                            <div className="absolute inset-0 rounded-xl bg-indigo-500/10 opacity-0 group-hover:opacity-100 transition-opacity" />
                        </div>
                        <span className="text-lg font-bold bg-clip-text text-transparent bg-gradient-to-r from-white to-neutral-400 group-hover:to-white transition-all">
                            ItsMyScreen
                        </span>
                    </Link>

                    {/* Actions */}
                    <div className="flex items-center gap-3">
                        {!isCreatePage && (
                            <Link
                                href="/create"
                                className="flex items-center gap-2 px-5 py-2.5 text-sm font-semibold text-white bg-indigo-600 rounded-full hover:bg-indigo-500 hover:shadow-[0_0_24px_-6px_rgba(99,102,241,0.5)] active:scale-95 transition-all"
                            >
                                <Plus className="w-4 h-4" />
                                Create Poll
                            </Link>
                        )}
                    </div>
                </div>
            </div>

            {/* Glow line */}
            <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-indigo-500/40 to-transparent" />
        </nav>
    );
}
