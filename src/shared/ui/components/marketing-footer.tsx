import Link from 'next/link';

export function MarketingFooter() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-navaa-warm-beige text-navaa-gray-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-x-16 gap-y-8">
          {/* Logo and Description */}
          <div className="lg:col-span-2">
            <h3 className="text-xl font-bold mb-4">navaa</h3>
            <p className="text-navaa-gray-600">
              Lern nicht härter - lern smarter. navaa nutzt KI, um dich schneller als andere
              Lernmethoden zu enablen.
            </p>
          </div>

          {/* navaa für Column */}
          <div>
            <h4 className="text-lg font-semibold mb-4">navaa für</h4>
            <ul className="space-y-2">
              <li>
                <Link
                  href="/einzelpersonen"
                  className="text-navaa-gray-600 hover:text-navaa-accent transition-colors duration-200"
                >
                  Einzelpersonen
                </Link>
              </li>
              <li>
                <Link
                  href="/unternehmen"
                  className="text-navaa-gray-600 hover:text-navaa-accent transition-colors duration-200"
                >
                  Unternehmen
                </Link>
              </li>
              <li>
                <Link
                  href="/hochschulen"
                  className="text-navaa-gray-600 hover:text-navaa-accent transition-colors duration-200"
                >
                  Hochschulen
                </Link>
              </li>
            </ul>
          </div>

          {/* Unternehmen Column */}
          <div>
            <h4 className="text-lg font-semibold mb-4">Unternehmen</h4>
            <ul className="space-y-2">
              <li>
                <Link
                  href="/team"
                  className="text-navaa-gray-600 hover:text-navaa-accent transition-colors duration-200"
                >
                  Team
                </Link>
              </li>
              <li>
                <Link
                  href="/lernansatz"
                  className="text-navaa-gray-600 hover:text-navaa-accent transition-colors duration-200"
                >
                  Unser Lernansatz
                </Link>
              </li>
              <li>
                <Link
                  href="/kontakt"
                  className="text-navaa-gray-600 hover:text-navaa-accent transition-colors duration-200"
                >
                  Kontakt
                </Link>
              </li>
            </ul>
          </div>

          {/* Rechtliches Column */}
          <div>
            <h4 className="text-lg font-semibold mb-4">Rechtliches</h4>
            <ul className="space-y-2">
              <li>
                <Link
                  href="/impressum"
                  className="text-navaa-gray-600 hover:text-navaa-accent transition-colors duration-200"
                >
                  Impressum
                </Link>
              </li>
              <li>
                <Link
                  href="/datenschutz"
                  className="text-navaa-gray-600 hover:text-navaa-accent transition-colors duration-200"
                >
                  Datenschutz
                </Link>
              </li>
              <li>
                <Link
                  href="/agb"
                  className="text-navaa-gray-600 hover:text-navaa-accent transition-colors duration-200"
                >
                  AGB
                </Link>
              </li>
            </ul>
          </div>
        </div>

        {/* Copyright */}
        <div className="mt-8 pt-8">
          <p className="text-center text-navaa-gray-600">
            © {currentYear} Navaa. Alle Rechte vorbehalten.
          </p>
        </div>
      </div>
    </footer>
  );
}
