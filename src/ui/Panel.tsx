import React from 'react';
const cx = (...classes: Array<string | undefined | false | null>) =>
  classes.filter(Boolean).join(' ');

type PanelProps = {
  as?: keyof JSX.IntrinsicElements;
  className?: string;
  children: React.ReactNode;
};

const Panel: React.FC<PanelProps> = ({ as = 'div', className, children }) => {
  const Tag = as as keyof JSX.IntrinsicElements;
  return <Tag className={cx('bg-white rounded-xl shadow p-6', className)}>{children}</Tag>;
};

export default Panel;
