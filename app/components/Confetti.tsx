'use client';

import { useMemo } from 'react';

const CONFETTI_COLORS = [
  '#c2410c',
  '#ea580c',
  '#f97316',
  '#0d9488',
  '#14b8a6',
  '#78716c',
  '#57534e',
];

function seededRandom(seed: number): number {
  const x = Math.sin(seed * 9999) * 10000;
  return x - Math.floor(x);
}

function ConfettiPiece({ index }: { index: number }) {
  const style = useMemo<React.CSSProperties>(() => {
    const s = index * 7;
    return {
      left: `${seededRandom(s) * 100}%`,
      top: '-5%',
      width: `${6 + seededRandom(s + 1) * 8}px`,
      height: `${6 + seededRandom(s + 2) * 8}px`,
      backgroundColor: CONFETTI_COLORS[index % CONFETTI_COLORS.length],
      animationDelay: `${seededRandom(s + 3) * 0.8}s`,
      animationDuration: `${1.2 + seededRandom(s + 4) * 1.2}s`,
      borderRadius: seededRandom(s + 5) > 0.5 ? '50%' : '2px',
    };
  }, [index]);
  return <div className="confetti-piece" style={style} />;
}

export default function Confetti() {
  return (
    <div className="fixed inset-0 z-50 pointer-events-none print:hidden">
      {Array.from({ length: 40 }).map((_, i) => (
        <ConfettiPiece key={i} index={i} />
      ))}
    </div>
  );
}
