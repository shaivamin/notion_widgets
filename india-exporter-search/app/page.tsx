import Link from 'next/link'

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      {/* Header */}
      <header className="border-b bg-white/80 backdrop-blur-sm">
        <div className="mx-auto max-w-7xl px-4 py-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="h-8 w-8 rounded-lg bg-gradient-to-br from-blue-600 to-indigo-600" />
              <span className="text-xl font-bold text-gray-900">ExporterSearch</span>
            </div>
            <nav className="flex items-center gap-4">
              <Link
                href="/login"
                className="text-sm font-medium text-gray-700 hover:text-gray-900"
              >
                Login
              </Link>
              <Link
                href="/signup"
                className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700"
              >
                Sign Up
              </Link>
            </nav>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8">
        <div className="text-center">
          <h1 className="text-5xl font-bold tracking-tight text-gray-900 sm:text-6xl">
            Find Verified <span className="text-blue-600">Exporters</span> and{' '}
            <span className="text-indigo-600">Buyers</span> in India
          </h1>
          <p className="mx-auto mt-6 max-w-2xl text-lg text-gray-600">
            Access comprehensive data on Indian importers and exporters. Search by product,
            HSN code, company, or country. Verified contact details, trade values, and more.
          </p>
          <div className="mt-10 flex justify-center gap-4">
            <Link
              href="/signup"
              className="rounded-lg bg-blue-600 px-8 py-3 text-base font-medium text-white hover:bg-blue-700"
            >
              Get Started Free
            </Link>
            <Link
              href="/pricing"
              className="rounded-lg border border-gray-300 bg-white px-8 py-3 text-base font-medium text-gray-700 hover:bg-gray-50"
            >
              View Pricing
            </Link>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8">
        <div className="grid gap-8 md:grid-cols-3">
          <div className="rounded-2xl bg-white p-8 shadow-sm">
            <div className="mb-4 h-12 w-12 rounded-lg bg-blue-100 flex items-center justify-center">
              <svg className="h-6 w-6 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>
            <h3 className="text-xl font-semibold text-gray-900">Advanced Search</h3>
            <p className="mt-2 text-gray-600">
              Search by product name, HSN code, category, country, and import value with powerful filters.
            </p>
          </div>

          <div className="rounded-2xl bg-white p-8 shadow-sm">
            <div className="mb-4 h-12 w-12 rounded-lg bg-indigo-100 flex items-center justify-center">
              <svg className="h-6 w-6 text-indigo-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <h3 className="text-xl font-semibold text-gray-900">Verified Data</h3>
            <p className="mt-2 text-gray-600">
              All companies are verified through automated checks and manual review by our team.
            </p>
          </div>

          <div className="rounded-2xl bg-white p-8 shadow-sm">
            <div className="mb-4 h-12 w-12 rounded-lg bg-green-100 flex items-center justify-center">
              <svg className="h-6 w-6 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
              </svg>
            </div>
            <h3 className="text-xl font-semibold text-gray-900">Flexible Pricing</h3>
            <p className="mt-2 text-gray-600">
              Choose between monthly subscriptions or pay-as-you-go credits. Start free with 3 results per search.
            </p>
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="bg-white py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid gap-8 text-center md:grid-cols-3">
            <div>
              <div className="text-4xl font-bold text-blue-600">50,000+</div>
              <div className="mt-2 text-gray-600">Verified Companies</div>
            </div>
            <div>
              <div className="text-4xl font-bold text-indigo-600">1M+</div>
              <div className="mt-2 text-gray-600">Product Listings</div>
            </div>
            <div>
              <div className="text-4xl font-bold text-green-600">100+</div>
              <div className="mt-2 text-gray-600">Countries Covered</div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8">
        <div className="rounded-3xl bg-gradient-to-r from-blue-600 to-indigo-600 px-8 py-16 text-center text-white shadow-xl">
          <h2 className="text-3xl font-bold">Ready to Find Your Next Business Partner?</h2>
          <p className="mx-auto mt-4 max-w-2xl text-lg">
            Join thousands of exporters and buyers using our platform to grow their business.
          </p>
          <Link
            href="/signup"
            className="mt-8 inline-block rounded-lg bg-white px-8 py-3 text-base font-medium text-blue-600 hover:bg-gray-100"
          >
            Start Your Free Trial
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t bg-white py-12">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid gap-8 md:grid-cols-4">
            <div>
              <div className="flex items-center gap-2">
                <div className="h-8 w-8 rounded-lg bg-gradient-to-br from-blue-600 to-indigo-600" />
                <span className="text-lg font-bold text-gray-900">ExporterSearch</span>
              </div>
              <p className="mt-4 text-sm text-gray-600">
                Your trusted platform for finding verified exporters and buyers in India.
              </p>
            </div>
            <div>
              <h4 className="font-semibold text-gray-900">Product</h4>
              <ul className="mt-4 space-y-2">
                <li><Link href="/search" className="text-sm text-gray-600 hover:text-gray-900">Search</Link></li>
                <li><Link href="/pricing" className="text-sm text-gray-600 hover:text-gray-900">Pricing</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold text-gray-900">Legal</h4>
              <ul className="mt-4 space-y-2">
                <li><Link href="/privacy" className="text-sm text-gray-600 hover:text-gray-900">Privacy Policy</Link></li>
                <li><Link href="/terms" className="text-sm text-gray-600 hover:text-gray-900">Terms of Service</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold text-gray-900">Company</h4>
              <ul className="mt-4 space-y-2">
                <li><Link href="/about" className="text-sm text-gray-600 hover:text-gray-900">About</Link></li>
                <li><Link href="/contact" className="text-sm text-gray-600 hover:text-gray-900">Contact</Link></li>
              </ul>
            </div>
          </div>
          <div className="mt-12 border-t pt-8 text-center text-sm text-gray-600">
            © 2024 ExporterSearch. All rights reserved.
          </div>
        </div>
      </footer>
    </div>
  )
}
