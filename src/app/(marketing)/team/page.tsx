export default function TeamPage() {
  return (
    <div className="bg-navaa-warm-beige min-h-screen py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="max-w-3xl mx-auto">
          <h1 className="text-4xl font-bold text-navaa-gray-900 mb-8">About</h1>

          <div className="prose prose-lg max-w-none">
            <p className="text-xl text-navaa-gray-700 mb-8">
              Navaa is a project by{' '}
              <a
                href="https://www.linkedin.com/in/christianmaass/"
                target="_blank"
                rel="noopener noreferrer"
                className="text-navaa-accent hover:underline"
              >
                Dr. Christian Maaß
              </a>
              .
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
