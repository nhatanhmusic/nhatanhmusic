import type { Metadata } from 'next';
import { ComingSoon, placeholderTitle } from '@/components/ui/ComingSoon';

const SLUG = 'gio-hang';

export async function generateMetadata(): Promise<Metadata> {
  return { title: await placeholderTitle(SLUG) };
}

export default function Page() {
  return <ComingSoon slug={SLUG} />;
}
