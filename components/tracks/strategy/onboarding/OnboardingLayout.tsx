import React from 'react';

interface OnboardingLayoutProps {
  left: React.ReactNode;
  right: React.ReactNode;
  leftSpan?: number; // default 5
  rightSpan?: number; // default 7
  onboardingFirstOnMobile?: boolean; // if true, right appears first on mobile
}

const OnboardingLayout: React.FC<OnboardingLayoutProps> = ({
  left,
  right,
  leftSpan = 5,
  rightSpan = 7,
  onboardingFirstOnMobile = true,
}) => {
  const leftOrderMobile = onboardingFirstOnMobile ? 'order-2' : 'order-1';
  const rightOrderMobile = onboardingFirstOnMobile ? 'order-1' : 'order-2';

  const spanClass = (n: number) =>
    (
      ({
        4: 'lg:col-span-4',
        5: 'lg:col-span-5',
        6: 'lg:col-span-6',
        7: 'lg:col-span-7',
        8: 'lg:col-span-8',
      }) as Record<number, string>
    )[n] || 'lg:col-span-6';
  const leftColClass = spanClass(leftSpan);
  const rightColClass = spanClass(rightSpan);

  return (
    <div className="max-w-7xl mx-auto px-4 pt-8 pb-0">
      <div className="grid lg:grid-cols-12 gap-12">
        <div className={`${leftOrderMobile} lg:order-1 ${leftColClass}`}>{left}</div>
        <div className={`${rightOrderMobile} lg:order-2 ${rightColClass}`}>{right}</div>
      </div>
    </div>
  );
};

export default OnboardingLayout;
