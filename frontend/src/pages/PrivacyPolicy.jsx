import { Link } from 'react-router-dom';
import { Shield, Lock, Eye, Database } from 'lucide-react';

export default function PrivacyPolicy() {
  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <Shield className="h-16 w-16 text-primary-600 mx-auto mb-4" />
          <h1 className="text-4xl font-bold text-dark-900 mb-4">Privacy Policy</h1>
          <p className="text-gray-600">Last updated: February 24, 2026</p>
        </div>

        <div className="bg-white rounded-xl shadow-md p-8 space-y-8">
          <section>
            <h2 className="text-2xl font-bold text-dark-900 mb-4">1. Introduction</h2>
            <p className="text-gray-700 leading-relaxed">
              TicketHub ("we", "our", or "us") is committed to protecting your privacy. This Privacy Policy explains 
              how we collect, use, disclose, and safeguard your information when you use our platform.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-dark-900 mb-4 flex items-center">
              <Database className="h-6 w-6 mr-2 text-primary-600" />
              2. Information We Collect
            </h2>
            
            <h3 className="text-xl font-semibold text-dark-900 mb-3 mt-4">2.1 Personal Information</h3>
            <ul className="list-disc list-inside space-y-2 text-gray-700 ml-4">
              <li>Name and contact information (email, phone number)</li>
              <li>Account credentials (username, password)</li>
              <li>Payment information (M-Pesa phone number, transaction codes)</li>
              <li>Billing address and organization details (for organizers)</li>
            </ul>

            <h3 className="text-xl font-semibold text-dark-900 mb-3 mt-4">2.2 Transaction Data</h3>
            <ul className="list-disc list-inside space-y-2 text-gray-700 ml-4">
              <li>Purchase history and order details</li>
              <li>Ticket information and QR codes</li>
              <li>Payment transaction records</li>
            </ul>

            <h3 className="text-xl font-semibold text-dark-900 mb-3 mt-4">2.3 Technical Data</h3>
            <ul className="list-disc list-inside space-y-2 text-gray-700 ml-4">
              <li>IP address and browser type</li>
              <li>Device information and operating system</li>
              <li>Usage data and browsing patterns</li>
              <li>Cookies and similar tracking technologies</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-dark-900 mb-4 flex items-center">
              <Eye className="h-6 w-6 mr-2 text-primary-600" />
              3. How We Use Your Information
            </h2>
            <ul className="list-disc list-inside space-y-2 text-gray-700 ml-4">
              <li>Process ticket purchases and payments</li>
              <li>Deliver e-tickets and order confirmations</li>
              <li>Provide customer support and respond to inquiries</li>
              <li>Send important updates about your orders and events</li>
              <li>Improve our platform and user experience</li>
              <li>Prevent fraud and ensure platform security</li>
              <li>Send marketing communications (with your consent)</li>
              <li>Comply with legal obligations</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-dark-900 mb-4">4. Information Sharing</h2>
            <p className="text-gray-700 mb-3">We may share your information with:</p>
            <ul className="list-disc list-inside space-y-2 text-gray-700 ml-4">
              <li><strong>Event Organizers:</strong> Contact details for ticket delivery and event communication</li>
              <li><strong>Payment Processors:</strong> Transaction information to process payments</li>
              <li><strong>Service Providers:</strong> Third parties who assist in platform operations</li>
              <li><strong>Legal Authorities:</strong> When required by law or to protect our rights</li>
            </ul>
            <p className="text-gray-700 mt-4">
              We do not sell your personal information to third parties.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-dark-900 mb-4 flex items-center">
              <Lock className="h-6 w-6 mr-2 text-primary-600" />
              5. Data Security
            </h2>
            <p className="text-gray-700 leading-relaxed mb-3">
              We implement appropriate security measures to protect your information:
            </p>
            <ul className="list-disc list-inside space-y-2 text-gray-700 ml-4">
              <li>Encryption of sensitive data during transmission</li>
              <li>Secure storage of personal information</li>
              <li>Regular security assessments and updates</li>
              <li>Access controls and authentication measures</li>
              <li>Employee training on data protection</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-dark-900 mb-4">6. Your Rights</h2>
            <p className="text-gray-700 mb-3">You have the right to:</p>
            <ul className="list-disc list-inside space-y-2 text-gray-700 ml-4">
              <li>Access your personal information</li>
              <li>Correct inaccurate or incomplete data</li>
              <li>Request deletion of your data (subject to legal requirements)</li>
              <li>Object to processing of your information</li>
              <li>Withdraw consent for marketing communications</li>
              <li>Request a copy of your data</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-dark-900 mb-4">7. Cookies</h2>
            <p className="text-gray-700 leading-relaxed">
              We use cookies and similar technologies to enhance your experience, analyze usage, and provide personalized content. 
              You can control cookie preferences through your browser settings.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-dark-900 mb-4">8. Data Retention</h2>
            <p className="text-gray-700 leading-relaxed">
              We retain your information for as long as necessary to provide our services and comply with legal obligations. 
              Transaction records are maintained for accounting and legal purposes.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-dark-900 mb-4">9. Contact Us</h2>
            <p className="text-gray-700 mb-2">
              For privacy-related questions or to exercise your rights, contact us:
            </p>
            <div className="bg-gray-50 rounded-lg p-4 space-y-2">
              <p className="text-gray-700"><strong>Email:</strong> privacy@tickethub.com</p>
              <p className="text-gray-700"><strong>Phone:</strong> +254 700 000 000</p>
            </div>
          </section>
        </div>

        <div className="text-center mt-8">
          <Link to="/" className="text-primary-600 hover:text-primary-700 font-medium">
            ← Back to Home
          </Link>
        </div>
      </div>
    </div>
  );
}