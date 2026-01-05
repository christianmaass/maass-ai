export function WhoThisIsForSection() {
  return (
    <section id="who-this-is-for" className="relative py-16 bg-navaa-warm-beige overflow-hidden">
      {/* Gradient Overlay */}
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-black/5 pointer-events-none"></div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="max-w-3xl">
          <h2 className="text-4xl font-bold text-navaa-gray-900 mb-6">Who this is for</h2>

          <div className="space-y-4">
            <p className="text-xl text-navaa-gray-700">
              navaa is built for people who want to evolve their strategic thinking. It assumes
              solid experience in business, strategy, or entrepreneurial decision-making.
            </p>
            <p className="text-xl text-navaa-gray-700">
              If you expect AI to compensate for missing experience, navaa is not for you.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
