import Link from 'next/link';
import { Button } from '@/shared/ui';

interface CTAButtonProps {
  text: string;
  targetUrl: string;
}

export function CTAButton({ text, targetUrl }: CTAButtonProps) {
  return (
    <Link href={targetUrl}>
      <Button
        size="lg"
        className="bg-navaa-accent text-white hover:bg-navaa-accent/90 transition-colors duration-200 px-8 py-4 text-lg font-semibold"
      >
        {text}
      </Button>
    </Link>
  );
}
