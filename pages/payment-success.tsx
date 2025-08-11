import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import Header from '@layout/basic/Header';
import { Text } from '../components/ui/Typography';
import Footer from '@layout/basic/Footer';
import PaymentSuccessView from '@payments/components/PaymentSuccessView';

const PaymentSuccess: React.FC = () => {
  const router = useRouter();
  const { session_id } = router.query;
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (session_id) {
      // Hier könnte man die Session verifizieren
      // Für jetzt zeigen wir einfach die Success-Nachricht
      setLoading(false);
    }
  }, [session_id]);

  const handleContinue = () => {
    router.push('/cases');
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-navaa-bg-primary flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <Text variant="small" className="text-gray-600">
            Zahlung wird verarbeitet...
          </Text>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-navaa-bg-primary">
      <Header />

      <PaymentSuccessView sessionId={session_id} onContinue={handleContinue} />

      <Footer />
    </div>
  );
};

export default PaymentSuccess;
