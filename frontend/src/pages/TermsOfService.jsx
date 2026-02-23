import { Link } from 'react-router-dom';
import { FileText, AlertCircle } from 'lucide-react';

export default function TermsOfService() {
  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-12">
          <FileText className="h-16 w-16 text-primary-600 mx-auto mb-4" />
          <h1 className="text-4xl font-bold text-dark-900 mb-4">Terms of Service</h1>
          <p className="text-gray-600">Last updated: February 24, 2026</p>
        </div>

        {/* Important Notice */}
        <div className="bg-yellow-50 border-l-4 border-yellow-400 p-6 mb-8 rounded-r-lg">
          <div className="flex items-start">
            <AlertCircle className="h-6 w-6 text-yellow-600 mt-0.5 mr-3 flex-shrink-0" />
            <div>
              <h3 className="text-lg font-semibold text-yellow-900 mb-2">Important Notice</h3>
              <p className="text-yellow-800">
                Please read these terms carefully before using TicketHub. By purchasing tickets through our platform, 
                you agree to be bound by these terms and conditions.
              </p>
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="bg-white rounded-xl shadow-md p-8 space-y-8">
          <section>
            <h2 className="text-2xl font-bold text-dark-900 mb-4">1. Acceptance of Terms</h2>
            <p className="text-gray-700 leading-relaxed mb-4">
              By accessing and using TicketHub ("the Platform"), you accept and agree to be bound by these Terms of Service. 
              If you do not agree to these terms, please do not use our services.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-dark-900 mb-4">2. Ticket Purchase Terms</h2>
            
            <h3 className="text-xl font-semibold text-dark-900 mb-3 mt-4">2.1 Purchase Process</h3>
            <ul className="list-disc list-inside space-y-2 text-gray-700 ml-4">
              <li>All ticket purchases are subject to availability</li>
              <li>Prices are displayed in Kenyan Shillings (KSh) and include all applicable taxes</li>
              <li>You must provide accurate contact information for ticket delivery</li>
              <li>Payment must be completed within the specified time frame to secure your booking</li>
            </ul>

            <h3 className="text-xl font-semibold text-dark-900 mb-3 mt-4">2.2 No Refund Policy</h3>
            <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-4">
              <p className="text-red-900 font-semibold mb-2">⚠️ IMPORTANT: ALL SALES ARE FINAL</p>
              <ul className="list-disc list-inside space-y-2 text-red-800 ml-4">
                <li><strong>No refunds will be issued</strong> once a ticket purchase is completed and confirmed</li>
                <li>Tickets are <strong>non-transferable</strong> unless explicitly stated by the event organizer</li>
                <li>Event cancellations or postponements are at the discretion of the event organizer</li>
                <li>In case of event cancellation, refunds will only be processed if the organizer approves</li>
                <li>TicketHub acts as a ticketing platform and is not responsible for event-related refunds</li>
              </ul>
            </div>

            <h3 className="text-xl font-semibold text-dark-900 mb-3 mt-4">2.3 Ticket Delivery</h3>
            <ul className="list-disc list-inside space-y-2 text-gray-700 ml-4">
              <li>E-tickets will be delivered to the email address provided during purchase</li>
              <li>Tickets can be accessed through your TicketHub account dashboard</li>
              <li>You are responsible for presenting valid tickets at the event venue</li>
              <li>Lost or stolen tickets cannot be replaced or refunded</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-dark-900 mb-4">3. Payment Terms</h2>
            <ul className="list-disc list-inside space-y-2 text-gray-700 ml-4">
              <li>We accept payments via M-Pesa and other approved payment methods</li>
              <li>Payment must be completed at the time of booking</li>
              <li>Transaction codes must be valid and verified before ticket issuance</li>
              <li>Failed or incomplete payments will result in automatic order cancellation</li>
              <li>You are responsible for any transaction fees charged by your payment provider</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-dark-900 mb-4">4. User Account</h2>
            <ul className="list-disc list-inside space-y-2 text-gray-700 ml-4">
              <li>You must create an account to purchase tickets</li>
              <li>You are responsible for maintaining the confidentiality of your account credentials</li>
              <li>You must notify us immediately of any unauthorized use of your account</li>
              <li>We reserve the right to suspend or terminate accounts that violate these terms</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-dark-900 mb-4">5. Event Organizer Responsibilities</h2>
            <p className="text-gray-700 leading-relaxed mb-4">
              TicketHub is a platform that connects event organizers with ticket buyers. We are not responsible for:
            </p>
            <ul className="list-disc list-inside space-y-2 text-gray-700 ml-4">
              <li>The quality, safety, or legality of events listed on the platform</li>
              <li>Event cancellations, postponements, or venue changes</li>
              <li>The accuracy of event information provided by organizers</li>
              <li>Any disputes between buyers and event organizers</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-dark-900 mb-4">6. Prohibited Activities</h2>
            <p className="text-gray-700 mb-3">You agree not to:</p>
            <ul className="list-disc list-inside space-y-2 text-gray-700 ml-4">
              <li>Resell tickets at inflated prices (scalping)</li>
              <li>Use automated systems or bots to purchase tickets</li>
              <li>Share or duplicate tickets without authorization</li>
              <li>Provide false or misleading information</li>
              <li>Violate any applicable laws or regulations</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-dark-900 mb-4">7. Limitation of Liability</h2>
            <p className="text-gray-700 leading-relaxed">
              TicketHub shall not be liable for any indirect, incidental, special, consequential, or punitive damages 
              resulting from your use of the platform. Our total liability shall not exceed the amount paid for your ticket purchase.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-dark-900 mb-4">8. Changes to Terms</h2>
            <p className="text-gray-700 leading-relaxed">
              We reserve the right to modify these terms at any time. Changes will be effective immediately upon posting. 
              Your continued use of the platform constitutes acceptance of the modified terms.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-dark-900 mb-4">9. Governing Law</h2>
            <p className="text-gray-700 leading-relaxed">
              These terms shall be governed by and construed in accordance with the laws of Kenya. 
              Any disputes shall be subject to the exclusive jurisdiction of the courts in Nairobi, Kenya.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-dark-900 mb-4">10. Contact Information</h2>
            <p className="text-gray-700 leading-relaxed mb-2">
              If you have any questions about these Terms of Service, please contact us:
            </p>
            <div className="bg-gray-50 rounded-lg p-4 space-y-2">
              <p className="text-gray-700"><strong>Email:</strong> legal@tickethub.com</p>
              <p className="text-gray-700"><strong>Phone:</strong> +254 700 000 000</p>
              <p className="text-gray-700"><strong>Address:</strong> Nairobi, Kenya</p>
            </div>
          </section>
        </div>

        {/* Back to Home */}
        <div className="text-center mt-8">
          <Link to="/" className="text-primary-600 hover:text-primary-700 font-medium">
            ← Back to Home
          </Link>
        </div>
      </div>
    </div>
  );
}