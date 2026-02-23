import { Link } from 'react-router-dom';
import { HelpCircle, Mail, Phone, MessageCircle } from 'lucide-react';

export default function HelpCenter() {
  const faqs = [
    {
      question: "How do I purchase tickets?",
      answer: "Browse events, select your tickets, complete payment via M-Pesa, and receive your e-tickets instantly."
    },
    {
      question: "Can I get a refund?",
      answer: "No. All ticket sales are final and non-refundable. Please review your order carefully before purchasing."
    },
    {
      question: "How do I receive my tickets?",
      answer: "E-tickets are sent to your email and available in your dashboard immediately after payment confirmation."
    },
    {
      question: "What payment methods do you accept?",
      answer: "We currently accept M-Pesa payments. More payment options coming soon."
    },
    {
      question: "Can I transfer my ticket to someone else?",
      answer: "Tickets are non-transferable unless specified by the event organizer."
    },
    {
      question: "What if an event is cancelled?",
      answer: "Contact the event organizer directly. Refunds for cancelled events are at the organizer's discretion."
    }
  ];

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <HelpCircle className="h-16 w-16 text-primary-600 mx-auto mb-4" />
          <h1 className="text-4xl font-bold text-dark-900 mb-4">Help Center</h1>
          <p className="text-gray-600">Find answers to common questions</p>
        </div>

        {/* Contact Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          <div className="bg-white rounded-xl shadow-md p-6 text-center">
            <Mail className="h-12 w-12 text-primary-600 mx-auto mb-3" />
            <h3 className="font-bold mb-2">Email Us</h3>
            <p className="text-sm text-gray-600 mb-3">support@tickethub.com</p>
            <a href="mailto:support@tickethub.com" className="text-primary-600 text-sm font-medium">
              Send Email →
            </a>
          </div>
          
          <div className="bg-white rounded-xl shadow-md p-6 text-center">
            <Phone className="h-12 w-12 text-primary-600 mx-auto mb-3" />
            <h3 className="font-bold mb-2">Call Us</h3>
            <p className="text-sm text-gray-600 mb-3">+254 700 000 000</p>
            <a href="tel:+254700000000" className="text-primary-600 text-sm font-medium">
              Call Now →
            </a>
          </div>
          
          <div className="bg-white rounded-xl shadow-md p-6 text-center">
            <MessageCircle className="h-12 w-12 text-primary-600 mx-auto mb-3" />
            <h3 className="font-bold mb-2">Live Chat</h3>
            <p className="text-sm text-gray-600 mb-3">Mon-Fri, 9AM-6PM</p>
            <button className="text-primary-600 text-sm font-medium">
              Start Chat →
            </button>
          </div>
        </div>

        {/* FAQs */}
        <div className="bg-white rounded-xl shadow-md p-8">
          <h2 className="text-2xl font-bold text-dark-900 mb-6">Frequently Asked Questions</h2>
          <div className="space-y-6">
            {faqs.map((faq, index) => (
              <div key={index} className="border-b pb-6 last:border-b-0">
                <h3 className="text-lg font-semibold text-dark-900 mb-2">{faq.question}</h3>
                <p className="text-gray-700">{faq.answer}</p>
              </div>
            ))}
          </div>
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