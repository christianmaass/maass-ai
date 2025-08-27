interface TrackPageProps {
  params: Promise<{
    slug: string;
  }>;
}

export default async function TrackPage({ params }: TrackPageProps) {
  const { slug } = await params;

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">Track: {slug}</h1>
      <div className="bg-white shadow rounded-lg p-6">
        <p className="text-gray-600">Track details for {slug} will be displayed here.</p>
      </div>
    </div>
  );
}

export function generateStaticParams() {
  return [{ slug: 'example-track' }];
}
