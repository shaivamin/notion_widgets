import React from 'react';
import { Link } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { 
  Calendar, 
  Bell, 
  Users, 
  CheckCircle, 
  ArrowRight,
  Star,
  Shield,
  Clock
} from 'lucide-react';

const HomePage = () => {
  return (
    <>
      <Helmet>
        <title>School Events Hub - Never Miss Important School Activities</title>
        <meta name="description" content="A friendly, reliable way to stay connected with your child's school events. Get timely reminders and never miss important activities." />
        <meta name="keywords" content="school events, parent communication, calendar, reminders, education" />
      </Helmet>

      {/* Skip to main content for screen readers */}
      <a href="#main-content" className="skip-link">
        Skip to main content
      </a>

      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-green-50">
        {/* Navigation */}
        <nav className="bg-white shadow-sm border-b border-gray-200">
          <div className="container-responsive">
            <div className="flex items-center justify-between h-16">
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 bg-gradient-to-r from-blue-600 to-green-600 rounded-lg flex items-center justify-center">
                  <Calendar className="w-5 h-5 text-white" aria-hidden="true" />
                </div>
                <span className="text-xl font-bold text-gray-900">School Events Hub</span>
              </div>
              <div className="flex items-center space-x-4">
                <Link 
                  to="/login" 
                  className="text-gray-600 hover:text-gray-900 font-medium transition-colors"
                  aria-label="Sign in to your account"
                >
                  Sign In
                </Link>
                <Link 
                  to="/register" 
                  className="btn-primary"
                  aria-label="Create a new account"
                >
                  Get Started
                </Link>
              </div>
            </div>
          </div>
        </nav>

        {/* Hero Section */}
        <section className="section-spacing" id="main-content">
          <div className="container-responsive">
            <div className="text-center max-w-4xl mx-auto">
              <h1 className="heading-1 mb-6">
                Never Miss Important School Activities
              </h1>
              <p className="body-text text-xl mb-8 max-w-2xl mx-auto">
                A friendly, reliable way to stay connected with your child's school events. 
                Get timely reminders and keep track of everything that matters.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link 
                  to="/register" 
                  className="btn-primary btn-lg"
                  aria-label="Start using School Events Hub for free"
                >
                  Start Free Today
                  <ArrowRight className="w-5 h-5 ml-2" aria-hidden="true" />
                </Link>
                <Link 
                  to="/login" 
                  className="btn-secondary btn-lg"
                  aria-label="Sign in to existing account"
                >
                  Sign In
                </Link>
              </div>
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section className="section-spacing bg-white">
          <div className="container-responsive">
            <div className="text-center mb-12">
              <h2 className="heading-2 mb-4">
                Everything You Need in One Place
              </h2>
              <p className="body-text text-lg max-w-2xl mx-auto">
                Simple tools that make school communication easier for busy parents.
              </p>
            </div>

            <div className="grid-responsive">
              {/* Feature 1 */}
              <div className="card p-6 text-center">
                <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mx-auto mb-4">
                  <Calendar className="w-6 h-6 text-blue-600" aria-hidden="true" />
                </div>
                <h3 className="heading-4 mb-3">
                  Centralized Calendar
                </h3>
                <p className="body-text-small">
                  See all your children's events in one easy-to-use calendar. 
                  No more checking multiple places for information.
                </p>
              </div>

              {/* Feature 2 */}
              <div className="card p-6 text-center">
                <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mx-auto mb-4">
                  <Bell className="w-6 h-6 text-green-600" aria-hidden="true" />
                </div>
                <h3 className="heading-4 mb-3">
                  Smart Reminders
                </h3>
                <p className="body-text-small">
                  Get helpful reminders before important events. 
                  Choose when and how you want to be notified.
                </p>
              </div>

              {/* Feature 3 */}
              <div className="card p-6 text-center">
                <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mx-auto mb-4">
                  <Users className="w-6 h-6 text-purple-600" aria-hidden="true" />
                </div>
                <h3 className="heading-4 mb-3">
                  Multiple Children
                </h3>
                <p className="body-text-small">
                  Manage events for all your children in one place. 
                  Perfect for families with kids in different schools.
                </p>
              </div>

              {/* Feature 4 */}
              <div className="card p-6 text-center">
                <div className="w-12 h-12 bg-yellow-100 rounded-lg flex items-center justify-center mx-auto mb-4">
                  <Shield className="w-6 h-6 text-yellow-600" aria-hidden="true" />
                </div>
                <h3 className="heading-4 mb-3">
                  Safe and Secure
                </h3>
                <p className="body-text-small">
                  Your family's information is protected with bank-level security. 
                  We follow strict privacy guidelines.
                </p>
              </div>

              {/* Feature 5 */}
              <div className="card p-6 text-center">
                <div className="w-12 h-12 bg-red-100 rounded-lg flex items-center justify-center mx-auto mb-4">
                  <CheckCircle className="w-6 h-6 text-red-600" aria-hidden="true" />
                </div>
                <h3 className="heading-4 mb-3">
                  Easy RSVP
                </h3>
                <p className="body-text-small">
                  Quickly respond to events that need confirmation. 
                  Let teachers know if you can attend.
                </p>
              </div>

              {/* Feature 6 */}
              <div className="card p-6 text-center">
                <div className="w-12 h-12 bg-indigo-100 rounded-lg flex items-center justify-center mx-auto mb-4">
                  <Clock className="w-6 h-6 text-indigo-600" aria-hidden="true" />
                </div>
                <h3 className="heading-4 mb-3">
                  Works on Any Device
                </h3>
                <p className="body-text-small">
                  Access your events on your phone, tablet, or computer. 
                  Everything stays in sync automatically.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* How It Works Section */}
        <section className="section-spacing">
          <div className="container-responsive">
            <div className="text-center mb-12">
              <h2 className="heading-2 mb-4">
                How It Works
              </h2>
              <p className="body-text text-lg max-w-2xl mx-auto">
                Getting started is simple. Here's what happens in just three easy steps.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {/* Step 1 */}
              <div className="text-center">
                <div className="w-16 h-16 bg-blue-600 text-white rounded-full flex items-center justify-center mx-auto mb-4 text-xl font-bold">
                  1
                </div>
                <h3 className="heading-4 mb-3">
                  Create Your Account
                </h3>
                <p className="body-text-small">
                  Sign up with your email address. It takes less than two minutes to get started.
                </p>
              </div>

              {/* Step 2 */}
              <div className="text-center">
                <div className="w-16 h-16 bg-green-600 text-white rounded-full flex items-center justify-center mx-auto mb-4 text-xl font-bold">
                  2
                </div>
                <h3 className="heading-4 mb-3">
                  Add Your Children
                </h3>
                <p className="body-text-small">
                  Tell us about your children and their schools. We'll connect you to their events.
                </p>
              </div>

              {/* Step 3 */}
              <div className="text-center">
                <div className="w-16 h-16 bg-purple-600 text-white rounded-full flex items-center justify-center mx-auto mb-4 text-xl font-bold">
                  3
                </div>
                <h3 className="heading-4 mb-3">
                  Stay Connected
                </h3>
                <p className="body-text-small">
                  Receive helpful reminders and never miss important school activities again.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Testimonials Section */}
        <section className="section-spacing bg-white">
          <div className="container-responsive">
            <div className="text-center mb-12">
              <h2 className="heading-2 mb-4">
                What Parents Are Saying
              </h2>
              <p className="body-text text-lg max-w-2xl mx-auto">
                Join thousands of parents who trust School Events Hub to stay connected.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {/* Testimonial 1 */}
              <div className="card p-6">
                <div className="flex items-center mb-4">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="w-4 h-4 text-yellow-400 fill-current" aria-hidden="true" />
                  ))}
                </div>
                <p className="body-text-small mb-4">
                  "This app has been a lifesaver! I never miss my kids' events anymore. 
                  The reminders are perfect for my busy schedule."
                </p>
                <div className="flex items-center">
                  <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center mr-3">
                    <span className="text-blue-600 font-semibold">S</span>
                  </div>
                  <div>
                    <p className="font-medium text-gray-900">Sarah M.</p>
                    <p className="text-sm text-gray-600">Parent of 2</p>
                  </div>
                </div>
              </div>

              {/* Testimonial 2 */}
              <div className="card p-6">
                <div className="flex items-center mb-4">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="w-4 h-4 text-yellow-400 fill-current" aria-hidden="true" />
                  ))}
                </div>
                <p className="body-text-small mb-4">
                  "Finally, a simple way to keep track of everything! 
                  The calendar view makes it easy to plan our family schedule."
                </p>
                <div className="flex items-center">
                  <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center mr-3">
                    <span className="text-green-600 font-semibold">M</span>
                  </div>
                  <div>
                    <p className="font-medium text-gray-900">Mike R.</p>
                    <p className="text-sm text-gray-600">Parent of 3</p>
                  </div>
                </div>
              </div>

              {/* Testimonial 3 */}
              <div className="card p-6">
                <div className="flex items-center mb-4">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="w-4 h-4 text-yellow-400 fill-current" aria-hidden="true" />
                  ))}
                </div>
                <p className="body-text-small mb-4">
                  "The notifications are exactly what I needed. 
                  I always know when something important is coming up."
                </p>
                <div className="flex items-center">
                  <div className="w-10 h-10 bg-purple-100 rounded-full flex items-center justify-center mr-3">
                    <span className="text-purple-600 font-semibold">J</span>
                  </div>
                  <div>
                    <p className="font-medium text-gray-900">Jennifer L.</p>
                    <p className="text-sm text-gray-600">Parent of 1</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="section-spacing">
          <div className="container-responsive">
            <div className="card p-8 text-center max-w-3xl mx-auto">
              <h2 className="heading-2 mb-4">
                Ready to Get Started?
              </h2>
              <p className="body-text text-lg mb-6">
                Join thousands of parents who never miss important school events. 
                It's free to get started.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link 
                  to="/register" 
                  className="btn-primary btn-lg"
                  aria-label="Create your free account now"
                >
                  Create Free Account
                  <ArrowRight className="w-5 h-5 ml-2" aria-hidden="true" />
                </Link>
                <Link 
                  to="/login" 
                  className="btn-secondary btn-lg"
                  aria-label="Sign in to existing account"
                >
                  Sign In
                </Link>
              </div>
            </div>
          </div>
        </section>

        {/* Footer */}
        <footer className="bg-gray-900 text-white py-12">
          <div className="container-responsive">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
              <div className="col-span-1 md:col-span-2">
                <div className="flex items-center space-x-3 mb-4">
                  <div className="w-8 h-8 bg-gradient-to-r from-blue-600 to-green-600 rounded-lg flex items-center justify-center">
                    <Calendar className="w-5 h-5 text-white" aria-hidden="true" />
                  </div>
                  <span className="text-xl font-bold">School Events Hub</span>
                </div>
                <p className="body-text-small text-gray-300 mb-4">
                  Helping parents stay connected with their children's school activities. 
                  Simple, reliable, and secure.
                </p>
              </div>

              <div>
                <h3 className="font-semibold mb-4">Product</h3>
                <ul className="space-y-2">
                  <li><Link to="/features" className="text-gray-300 hover:text-white transition-colors">Features</Link></li>
                  <li><Link to="/pricing" className="text-gray-300 hover:text-white transition-colors">Pricing</Link></li>
                  <li><Link to="/security" className="text-gray-300 hover:text-white transition-colors">Security</Link></li>
                </ul>
              </div>

              <div>
                <h3 className="font-semibold mb-4">Support</h3>
                <ul className="space-y-2">
                  <li><Link to="/help" className="text-gray-300 hover:text-white transition-colors">Help Center</Link></li>
                  <li><Link to="/contact" className="text-gray-300 hover:text-white transition-colors">Contact Us</Link></li>
                  <li><Link to="/privacy" className="text-gray-300 hover:text-white transition-colors">Privacy Policy</Link></li>
                </ul>
              </div>
            </div>

            <div className="border-t border-gray-800 mt-8 pt-8 text-center">
              <p className="text-gray-400">
                © 2024 School Events Hub. All rights reserved.
              </p>
            </div>
          </div>
        </footer>
      </div>
    </>
  );
};

export default HomePage;