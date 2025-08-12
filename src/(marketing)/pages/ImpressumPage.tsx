import React from 'react';
import MarketingLayout from '@layout/basic/MarketingLayout';

const ImpressumPage: React.FC = () => {
  return (
    <MarketingLayout title="Impressum" description="Rechtliche Angaben zu navaa">
      <div className="max-w-3xl mx-auto">
        <h1 className="text-3xl font-bold mb-6 text-gray-900">Impressum</h1>
        <div className="space-y-4 text-base text-gray-800">
          <p>
            <strong>Angaben gemäß § 5 TMG:</strong>
          </p>
          <p>
            Dr. Christian Maaß
            <br />
            Am Leinritt 7
            <br />
            96049 Bamberg
          </p>
          <p>
            E-Mail:{' '}
            <a href="mailto:christian@christianmaass.com" className="text-blue-700 underline">
              christian@christianmaass.com
            </a>
          </p>
          <p>
            <strong>Verantwortlich für den Inhalt nach § 55 Abs. 2 RStV:</strong>
            <br />
            Christian Maaß, Anschrift wie oben.
          </p>
        </div>
      </div>
    </MarketingLayout>
  );
};

export default ImpressumPage;
