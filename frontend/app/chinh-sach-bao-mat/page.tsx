import type { Metadata } from 'next';
import { ComingSoon, placeholderTitle } from '@/components/ui/ComingSoon';

const SLUG = 'chinh-sach-bao-mat';

export async function generateMetadata(): Promise<Metadata> {
  return { title: await placeholderTitle(SLUG) };
}

export default function Page() {
  return <ComingSoon slug={SLUG} />;
}
