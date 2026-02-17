import { createClient } from '@supabase/supabase-js';
import type { Metadata } from 'next';

export async function generateMetadata({
  params,
}: {
  params: Promise<{ id: string }>;
}): Promise<Metadata> {
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
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL ?? 'https://itsmyscreen-by-sriram.vercel.app';

  return {
    title: `${question} — ItsMyScreen`,
    description: `Vote on this poll and see real-time results.`,
    openGraph: {
      title: `${question} — ItsMyScreen`,
      description: 'Vote now and see live results.',
      url: `${baseUrl}/poll/${id}`,
    },
    twitter: {
      card: 'summary_large_image',
      title: `${question} — ItsMyScreen`,
    },
  };
}

export default function PollLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
