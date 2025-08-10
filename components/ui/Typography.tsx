import React from 'react';
// simple class join helper to avoid extra deps
const cx = (...classes: Array<string | undefined | false | null>) =>
  classes.filter(Boolean).join(' ');

type HeadingVariant = 'display' | 'h1' | 'h2' | 'h3';

type HeadingProps = {
  as?: keyof JSX.IntrinsicElements;
  variant?: HeadingVariant;
  className?: string;
  children: React.ReactNode;
};

const headingClasses: Record<HeadingVariant, string> = {
  display: 'text-4xl font-bold text-gray-900',
  h1: 'text-2xl font-bold text-gray-900',
  h2: 'text-lg font-semibold text-gray-900',
  h3: 'text-base font-semibold text-gray-900',
};

export const Heading: React.FC<HeadingProps> = ({ as, variant = 'h1', className, children }) => {
  const Tag = (as || (variant === 'display' ? 'h1' : variant)) as keyof JSX.IntrinsicElements;
  return <Tag className={cx(headingClasses[variant], className)}>{children}</Tag>;
};

type TextVariant = 'body' | 'small' | 'micro' | 'muted';

type TextProps = {
  as?: keyof JSX.IntrinsicElements;
  variant?: TextVariant;
  className?: string;
  children: React.ReactNode;
};

const textClasses: Record<TextVariant, string> = {
  body: 'text-lg text-gray-700',
  small: 'text-sm text-gray-600',
  micro: 'text-xs text-gray-500',
  muted: 'text-gray-600',
};

export const Text: React.FC<TextProps> = ({ as = 'p', variant = 'body', className, children }) => {
  const Tag = as as keyof JSX.IntrinsicElements;
  return <Tag className={cx(textClasses[variant], className)}>{children}</Tag>;
};

const Typography = { Heading, Text };
export default Typography;
