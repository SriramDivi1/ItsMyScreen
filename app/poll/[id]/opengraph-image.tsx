import { ImageResponse } from 'next/og';
import { createClient } from '@supabase/supabase-js';

export const alt = 'Poll';
export const size = { width: 1200, height: 630 };
export const contentType = 'image/png';

export default async function Image({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL ?? '',
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ?? ''
  );
  const { data: poll } = await supabase
    .from('polls')
    .select('question')
    .eq('id', id)
    .single();

  const question = poll?.question ?? 'Vote on this poll';

  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          background: 'linear-gradient(135deg, #0a0a12 0%, #1a1a25 100%)',
          padding: 48,
        }}
      >
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: 12,
            marginBottom: 32,
            color: '#a78bfa',
            fontSize: 24,
          }}
        >
          <span
            style={{
              width: 40,
              height: 40,
              borderRadius: 10,
              background: 'linear-gradient(135deg, #8b5cf6, #06b6d4)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            ✓
          </span>
          ItsMyScreen — Real-time Polls
        </div>
        <div
          style={{
            fontSize: 48,
            fontWeight: 700,
            color: '#f0f0f5',
            textAlign: 'center',
            maxWidth: 1000,
            lineHeight: 1.2,
            display: 'flex',
            flexWrap: 'wrap',
            justifyContent: 'center',
          }}
        >
          {question.length > 80 ? `${question.slice(0, 77)}...` : question}
        </div>
        <div
          style={{
            marginTop: 32,
            fontSize: 20,
            color: '#8888a0',
          }}
        >
          Vote now · Live results
        </div>
      </div>
    ),
    { ...size }
  );
}
