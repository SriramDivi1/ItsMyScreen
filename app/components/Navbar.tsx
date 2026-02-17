'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Zap, Plus } from 'lucide-react';

export default function Navbar() {
    const pathname = usePathname();
    const isCreatePage = pathname === '/create';

    return (
        <nav className="fixed top-0 left-0 right-0 z-50">
            <div className="mx-auto max-w-6xl px-4 sm:px-6">
                <div className="flex items-center justify-between h-16 my-2 px-5 rounded-2xl glass-card">
                    <Link href="/" className="flex items-center gap-2.5 group">
                        <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-violet-500 to-cyan-500 flex items-center justify-center group-hover:shadow-lg group-hover:shadow-violet-500/25 transition-all duration-300">
                            <Zap className="w-4 h-4 text-white" />
                        </div>
                        <span className="text-lg font-bold tracking-tight">
                            <span className="gradient-text">ItsMyScreen</span>
                        </span>
                    </Link>

                    {!isCreatePage && (
                        <Link href="/create" className="btn-gradient text-sm !py-2.5 !px-5 !rounded-xl">
                            <Plus className="w-4 h-4" />
                            <span>Create Poll</span>
                        </Link>
                    )}
                </div>
            </div>
        </nav>
    );
}
