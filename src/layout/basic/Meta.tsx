import Head from 'next/head';
import React from 'react';

interface MetaProps {
  title?: string;
  description?: string;
}

export default function Meta({ title = 'navaa.ai', description = 'Learn smarter with navaa' }: MetaProps) {
  return (
    <Head>
      <title>{title}</title>
      <meta name="description" content={description} />
      <meta name="viewport" content="width=device-width, initial-scale=1" />
    </Head>
  );
}
