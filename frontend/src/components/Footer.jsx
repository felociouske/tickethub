import { Link } from 'react-router-dom';
import { 
  Ticket, 
  Mail, 
  Phone, 
  MapPin, 
  Facebook, 
  Twitter, 
  Instagram, 
  Linkedin,
  Youtube,
  ExternalLink,
  Heart
} from 'lucide-react';

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-gradient-to-b from-dark-900 to-black text-white mt-20">
      {/* Main Footer Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8 lg:gap-12">
          {/* Brand Section */}
          <div className="lg:col-span-2 space-y-6">
            <div className="flex items-center space-x-2">
              <div className="bg-gradient-to-r from-primary-500 to-secondary-500 p-2 rounded-lg">
                <Ticket className="h-8 w-8 text-white" />
              </div>
              <span className="text-3xl font-bold bg-gradient-to-r from-primary-500 to-secondary-500 bg-clip-text text-transparent">
                TicketHub
              </span>
            </div>
            <p className="text-gray-400 leading-relaxed max-w-md">
              Your gateway to unforgettable experiences. Discover and book tickets for concerts, 
              sports events, comedy shows, conferences, and much more across Kenya.
            </p>

            {/* Social Media Icons */}
            <div>
              <p className="text-sm font-semibold text-gray-300 mb-3">Follow Us</p>
              <div className="flex space-x-3">
                <a 
                  href="https://facebook.com/tickethub" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="bg-gray-800 hover:bg-primary-600 p-3 rounded-lg transition-colors duration-300"
                  aria-label="Facebook"
                >
                  <Facebook className="h-5 w-5" />
                </a>
                <a 
                  href="https://twitter.com/tickethub" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="bg-gray-800 hover:bg-primary-600 p-3 rounded-lg transition-colors duration-300"
                  aria-label="Twitter"
                >
                  <Twitter className="h-5 w-5" />
                </a>
                <a 
                  href="https://instagram.com/tickethub" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="bg-gray-800 hover:bg-primary-600 p-3 rounded-lg transition-colors duration-300"
                  aria-label="Instagram"
                >
                  <Instagram className="h-5 w-5" />
                </a>
                <a 
                  href="https://linkedin.com/company/tickethub" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="bg-gray-800 hover:bg-primary-600 p-3 rounded-lg transition-colors duration-300"
                  aria-label="LinkedIn"
                >
                  <Linkedin className="h-5 w-5" />
                </a>
                <a 
                  href="https://youtube.com/@tickethub" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="bg-gray-800 hover:bg-primary-600 p-3 rounded-lg transition-colors duration-300"
                  aria-label="YouTube"
                >
                  <Youtube className="h-5 w-5" />
                </a>
              </div>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="font-bold text-lg mb-4 text-white">Quick Links</h3>
            <ul className="space-y-3">
              <li>
                <Link 
                  to="/events" 
                  className="text-gray-400 hover:text-primary-500 transition-colors duration-200 flex items-center group"
                >
                  <span className="group-hover:translate-x-1 transition-transform duration-200">Browse Events</span>
                </Link>
              </li>
              <li>
                <Link 
                  to="/my-tickets" 
                  className="text-gray-400 hover:text-primary-500 transition-colors duration-200 flex items-center group"
                >
                  <span className="group-hover:translate-x-1 transition-transform duration-200">My Tickets</span>
                </Link>
              </li>
              <li>
                <Link 
                  to="/orders" 
                  className="text-gray-400 hover:text-primary-500 transition-colors duration-200 flex items-center group"
                >
                  <span className="group-hover:translate-x-1 transition-transform duration-200">My Orders</span>
                </Link>
              </li>
              <li>
                <Link 
                  to="/dashboard" 
                  className="text-gray-400 hover:text-primary-500 transition-colors duration-200 flex items-center group"
                >
                  <span className="group-hover:translate-x-1 transition-transform duration-200">Dashboard</span>
                </Link>
              </li>
              <li>
                <Link 
                  to="/profile" 
                  className="text-gray-400 hover:text-primary-500 transition-colors duration-200 flex items-center group"
                >
                  <span className="group-hover:translate-x-1 transition-transform duration-200">Profile</span>
                </Link>
              </li>
            </ul>
          </div>

          {/* For Organizers */}
          <div>
            <h3 className="font-bold text-lg mb-4 text-white">For Organizers</h3>
            <ul className="space-y-3">
              <li>
                <Link 
                  to="/organizer/register" 
                  className="text-gray-400 hover:text-primary-500 transition-colors duration-200 flex items-center group"
                >
                  <span className="group-hover:translate-x-1 transition-transform duration-200">Become an Organizer</span>
                </Link>
              </li>
              <li>
                <Link 
                  to="/organizer/dashboard" 
                  className="text-gray-400 hover:text-primary-500 transition-colors duration-200 flex items-center group"
                >
                  <span className="group-hover:translate-x-1 transition-transform duration-200">Organizer Dashboard</span>
                </Link>
              </li>
              <li>
                <Link 
                  to="/create-event" 
                  className="text-gray-400 hover:text-primary-500 transition-colors duration-200 flex items-center group"
                >
                  <span className="group-hover:translate-x-1 transition-transform duration-200">Create Event</span>
                </Link>
              </li>
              <li>
                <Link 
                  to="/pricing" 
                  className="text-gray-400 hover:text-primary-500 transition-colors duration-200 flex items-center group"
                >
                  <span className="group-hover:translate-x-1 transition-transform duration-200">Pricing</span>
                </Link>
              </li>
              <li>
                <a 
                  href="https://docs.tickethub.com" 
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-gray-400 hover:text-primary-500 transition-colors duration-200 flex items-center group"
                >
                  <span className="group-hover:translate-x-1 transition-transform duration-200">Documentation</span>
                  <ExternalLink className="h-3 w-3 ml-1 opacity-0 group-hover:opacity-100 transition-opacity" />
                </a>
              </li>
            </ul>
          </div>

          {/* Support & Legal */}
          <div>
            <h3 className="font-bold text-lg mb-4 text-white">Support & Legal</h3>
            <ul className="space-y-3 mb-6">
              <li>
                <Link 
                  to="/help" 
                  className="text-gray-400 hover:text-primary-500 transition-colors duration-200 flex items-center group"
                >
                  <span className="group-hover:translate-x-1 transition-transform duration-200">Help Center</span>
                </Link>
              </li>
              <li>
                <Link 
                  to="/terms" 
                  className="text-gray-400 hover:text-primary-500 transition-colors duration-200 flex items-center group"
                >
                  <span className="group-hover:translate-x-1 transition-transform duration-200">Terms of Service</span>
                </Link>
              </li>
              <li>
                <Link 
                  to="/privacy" 
                  className="text-gray-400 hover:text-primary-500 transition-colors duration-200 flex items-center group"
                >
                  <span className="group-hover:translate-x-1 transition-transform duration-200">Privacy Policy</span>
                </Link>
              </li>
            </ul>

            {/* Contact Info */}
            <div className="space-y-2 text-sm">
              <div className="flex items-center space-x-2 text-gray-400">
                <Mail className="h-4 w-4 text-primary-500" />
                <a href="mailto:support@tickethub.com" className="hover:text-primary-500 transition-colors">
                  support@tickethub.com
                </a>
              </div>
              <div className="flex items-center space-x-2 text-gray-400">
                <Phone className="h-4 w-4 text-primary-500" />
                <a href="tel:+254700000000" className="hover:text-primary-500 transition-colors">
                  +254 700 000 000
                </a>
              </div>
              <div className="flex items-center space-x-2 text-gray-400">
                <MapPin className="h-4 w-4 text-primary-500" />
                <span>Nairobi, Kenya</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
            <div className="text-gray-400 text-sm text-center md:text-left">
              <p>© {currentYear} TicketHub. All rights reserved.</p>
            </div>

            {/* Developer Credit */}
            <div className="flex items-center space-x-2 text-sm">
              <span className="text-gray-400">Crafted with</span>
              <Heart className="h-4 w-4 text-red-500 fill-current animate-pulse" />
              <span className="text-gray-400">by</span>
              <a 
                href="https://portfolio.martindev.com" 
                target="_blank"
                rel="noopener noreferrer"
                className="text-primary-500 hover:text-primary-400 font-semibold transition-colors"
              >
                TicketHub Tech
              </a>
            </div>

            {/* Payment Methods or Trust Badges */}
            <div className="flex items-center space-x-2 text-gray-500 text-xs">
              <span className="px-3 py-1 bg-gray-800 rounded-full">Secure Payments</span>
              <span className="px-3 py-1 bg-gray-800 rounded-full">M-Pesa</span>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}