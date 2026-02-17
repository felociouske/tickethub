import { useEffect, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { Calendar, MapPin, Clock, User, Minus, Plus, ShoppingCart, Share2, Heart } from 'lucide-react';
import { format } from 'date-fns';
import { eventsAPI } from '../services/api';
import useCartStore from '../store/cartStore';
import useAuthStore from '../store/authStore';
import EventCard from '../components/EventCard';
import toast from 'react-hot-toast';

export default function EventDetail() {
  const { slug } = useParams();
  const navigate = useNavigate();
  const { isAuthenticated } = useAuthStore();
  const { addItem, setEvent } = useCartStore();
  
  const [event, setEventData] = useState(null);
  const [relatedEvents, setRelatedEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedTickets, setSelectedTickets] = useState({});

  useEffect(() => {
    fetchEventDetail();
  }, [slug]);

  const fetchEventDetail = async () => {
    try {
      const response = await eventsAPI.getEvent(slug);
      setEventData(response.data);
      setEvent(response.data);

      // Fetch related events from same category
      if (response.data.category) {
        const relatedResponse = await eventsAPI.getEvents({
          category: response.data.category.id,
          page_size: 4,
        });
        const filtered = (relatedResponse.data.results || relatedResponse.data).filter(
          (e) => e.id !== response.data.id
        );
        setRelatedEvents(filtered);
      }
    } catch (error) {
      toast.error('Failed to load event details');
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const updateTicketQuantity = (ticketTypeId, change) => {
    const ticketType = event.ticket_types.find((t) => t.id === ticketTypeId);
    const currentQty = selectedTickets[ticketTypeId] || 0;
    const newQty = Math.max(0, Math.min(currentQty + change, ticketType.max_purchase, ticketType.tickets_remaining));
    
    if (newQty >= ticketType.min_purchase || newQty === 0) {
      setSelectedTickets({ ...selectedTickets, [ticketTypeId]: newQty });
    } else {
      toast.error(`Minimum purchase is ${ticketType.min_purchase} tickets`);
    }
  };

  const getTotalAmount = () => {
    return Object.entries(selectedTickets).reduce((total, [ticketTypeId, quantity]) => {
      const ticketType = event.ticket_types.find((t) => t.id === parseInt(ticketTypeId));
      return total + (ticketType.price * quantity);
    }, 0);
  };

  const getTotalTickets = () => {
    return Object.values(selectedTickets).reduce((sum, qty) => sum + qty, 0);
  };

  const handleProceedToCheckout = () => {
    if (!isAuthenticated) {
      toast.error('Please login to purchase tickets');
      navigate('/login');
      return;
    }

    const totalTickets = getTotalTickets();
    if (totalTickets === 0) {
      toast.error('Please select at least one ticket');
      return;
    }

    // Add items to cart
    Object.entries(selectedTickets).forEach(([ticketTypeId, quantity]) => {
      if (quantity > 0) {
        const ticketType = event.ticket_types.find((t) => t.id === parseInt(ticketTypeId));
        addItem(ticketType, quantity);
      }
    });

    navigate('/checkout');
  };

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: event.title,
        text: event.description,
        url: window.location.href,
      });
    } else {
      navigator.clipboard.writeText(window.location.href);
      toast.success('Link copied to clipboard!');
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  if (!event) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Event not found</h2>
          <Link to="/events" className="text-primary-600 hover:text-primary-700">
            Browse other events
          </Link>
        </div>
      </div>
    );
  }

  const formatDate = (dateString) => format(new Date(dateString), 'EEEE, MMMM dd, yyyy');
  const formatTime = (dateString) => format(new Date(dateString), 'h:mm a');

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <div className="relative h-96 bg-gradient-to-r from-primary-600 to-primary-800">
        {event.banner_image ? (
          <img
            src={event.banner_image}
            alt={event.title}
            className="w-full h-full object-cover opacity-30"
          />
        ) : null}
        <div className="absolute inset-0 flex items-center">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
            <div className="max-w-3xl">
              {event.category && (
                <span className="inline-block bg-secondary-500 text-white px-4 py-1 rounded-full text-sm font-semibold mb-4">
                  {event.category.name}
                </span>
              )}
              <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
                {event.title}
              </h1>
              <p className="text-xl text-white opacity-90 mb-6">
                {event.description.substring(0, 200)}...
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-8">
            {/* Event Info Card */}
            <div className="bg-white rounded-xl shadow-md p-6">
              <h2 className="text-2xl font-bold text-dark-900 mb-6">Event Details</h2>
              
              <div className="space-y-4">
                <div className="flex items-start space-x-4">
                  <Calendar className="h-6 w-6 text-primary-600 mt-1" />
                  <div>
                    <p className="font-semibold text-dark-900">Date & Time</p>
                    <p className="text-gray-600">{formatDate(event.start_date)}</p>
                    <p className="text-gray-600">
                      {formatTime(event.start_date)} - {formatTime(event.end_date)}
                    </p>
                  </div>
                </div>

                <div className="flex items-start space-x-4">
                  <MapPin className="h-6 w-6 text-primary-600 mt-1" />
                  <div>
                    <p className="font-semibold text-dark-900">Location</p>
                    <p className="text-gray-600">{event.venue_name}</p>
                    <p className="text-gray-600">{event.venue_address}</p>
                    <p className="text-gray-600">{event.city}, {event.country}</p>
                  </div>
                </div>

                <div className="flex items-start space-x-4">
                  <User className="h-6 w-6 text-primary-600 mt-1" />
                  <div>
                    <p className="font-semibold text-dark-900">Organized by</p>
                    <p className="text-gray-600">{event.organizer?.full_name || event.organizer?.email || 'Organizer'}</p>
                    {event.organizer?.organization_name && (
                      <p className="text-gray-600">{event.organizer.organization_name}</p>
                    )}
                  </div>
                </div>
              </div>
            </div>

            {/* Description */}
            <div className="bg-white rounded-xl shadow-md p-6">
              <h2 className="text-2xl font-bold text-dark-900 mb-4">About This Event</h2>
              <p className="text-gray-700 leading-relaxed whitespace-pre-line">
                {event.description}
              </p>
            </div>

            {/* Ticket Types */}
            <div className="bg-white rounded-xl shadow-md p-6">
              <h2 className="text-2xl font-bold text-dark-900 mb-6">Select Tickets</h2>
              
              <div className="space-y-4">
                {event.ticket_types.map((ticketType) => (
                  <div
                    key={ticketType.id}
                    className="border-2 border-gray-200 rounded-lg p-4 hover:border-primary-500 transition-colors"
                  >
                    <div className="flex justify-between items-start mb-3">
                      <div>
                        <h3 className="font-bold text-lg text-dark-900">{ticketType.name}</h3>
                        {ticketType.description && (
                          <p className="text-gray-600 text-sm mt-1">{ticketType.description}</p>
                        )}
                      </div>
                      <div className="text-right">
                        <p className="text-2xl font-bold text-primary-600">
                          KSh {parseFloat(ticketType.price).toLocaleString()}
                        </p>
                      </div>
                    </div>

                    <div className="flex justify-between items-center">
                      <div className="text-sm text-gray-600">
                        {ticketType.is_available ? (
                          <span className="text-green-600 font-medium">
                            {ticketType.tickets_remaining} tickets available
                          </span>
                        ) : (
                          <span className="text-red-600 font-medium">Sold Out</span>
                        )}
                      </div>

                      {ticketType.is_available && (
                        <div className="flex items-center space-x-3">
                          <button
                            onClick={() => updateTicketQuantity(ticketType.id, -1)}
                            disabled={!selectedTickets[ticketType.id]}
                            className="w-8 h-8 rounded-full border-2 border-gray-300 flex items-center justify-center hover:border-primary-600 hover:text-primary-600 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
                          >
                            <Minus className="h-4 w-4" />
                          </button>
                          
                          <span className="w-12 text-center font-bold text-lg">
                            {selectedTickets[ticketType.id] || 0}
                          </span>
                          
                          <button
                            onClick={() => updateTicketQuantity(ticketType.id, 1)}
                            disabled={
                              selectedTickets[ticketType.id] >= ticketType.tickets_remaining ||
                              selectedTickets[ticketType.id] >= ticketType.max_purchase
                            }
                            className="w-8 h-8 rounded-full border-2 border-gray-300 flex items-center justify-center hover:border-primary-600 hover:text-primary-600 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
                          >
                            <Plus className="h-4 w-4" />
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-1">
            {/* Purchase Summary - Sticky */}
            <div className="bg-white rounded-xl shadow-md p-6 sticky top-20">
              <h3 className="text-xl font-bold text-dark-900 mb-4">Order Summary</h3>
              
              {getTotalTickets() > 0 ? (
                <div className="space-y-4">
                  {Object.entries(selectedTickets).map(([ticketTypeId, quantity]) => {
                    if (quantity === 0) return null;
                    const ticketType = event.ticket_types.find((t) => t.id === parseInt(ticketTypeId));
                    return (
                      <div key={ticketTypeId} className="flex justify-between text-sm">
                        <span className="text-gray-600">
                          {quantity}x {ticketType.name}
                        </span>
                        <span className="font-semibold">
                          KSh {(ticketType.price * quantity).toLocaleString()}
                        </span>
                      </div>
                    );
                  })}
                  
                  <div className="border-t pt-4">
                    <div className="flex justify-between items-center mb-4">
                      <span className="text-lg font-bold text-dark-900">Total</span>
                      <span className="text-2xl font-bold text-primary-600">
                        KSh {getTotalAmount().toLocaleString()}
                      </span>
                    </div>
                    
                    <button
                      onClick={handleProceedToCheckout}
                      className="w-full btn-primary flex items-center justify-center space-x-2"
                    >
                      <ShoppingCart className="h-5 w-5" />
                      <span>Proceed to Checkout</span>
                    </button>
                  </div>
                </div>
              ) : (
                <p className="text-gray-600 text-center py-4">
                  Select tickets to see your order summary
                </p>
              )}

              <div className="mt-6 pt-6 border-t">
                <button
                  onClick={handleShare}
                  className="w-full btn-outline flex items-center justify-center space-x-2"
                >
                  <Share2 className="h-5 w-5" />
                  <span>Share Event</span>
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Related Events */}
        {relatedEvents.length > 0 && (
          <div className="mt-16">
            <h2 className="text-3xl font-bold text-dark-900 mb-8">More Events You Might Like</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {relatedEvents.map((relatedEvent) => (
                <EventCard key={relatedEvent.id} event={relatedEvent} />
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}