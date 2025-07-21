import React from 'react';
import { NextPageContext } from 'next';

interface ErrorProps {
  statusCode?: number;
}

function Error({ statusCode }: ErrorProps) {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-white">
      <h1 className="text-6xl font-bold text-gray-800 mb-4">{statusCode || 'Error'}</h1>
      <p className="text-lg text-gray-600 mb-8">
        {statusCode
          ? `Ein Fehler ${statusCode} ist aufgetreten.`
          : 'Ein Fehler ist aufgetreten.'}
      </p>
      <a href="/" className="px-6 py-3 bg-gray-800 text-white rounded-lg font-bold hover:bg-gray-900 transition-colors">
        Zurück zur Startseite
      </a>
    </div>
  );
}

Error.getInitialProps = ({ res, err }: NextPageContext) => {
  const statusCode = res ? res.statusCode : err ? err.statusCode : 404;
  return { statusCode };
};

export default Error;
