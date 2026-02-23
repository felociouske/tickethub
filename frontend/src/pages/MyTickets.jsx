import { useEffect, useState } from 'react';
import { Ticket, Calendar, MapPin, Download, QrCode } from 'lucide-react';
import { downloadTicket } from '../utils/ticketDownload';
import { format } from 'date-fns';
import { ordersAPI } from '../services/api';
import toast from 'react-hot-toast';

export default function MyTickets() {
  const [tickets, setTickets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all'); 

  useEffect(() => {
    fetchTickets();
  }, []);

  const fetchTickets = async () => {
    try {
      const response = await ordersAPI.getMyTickets();
      const ticketsData = response.data.results || [];  
      setTickets(ticketsData);
    } catch (error) {
      toast.error('Failed to load tickets');
      console.error(error);
      setTickets([]);
    } finally {
      setLoading(false);
    }
  };

  const filteredTickets = tickets.filter((ticket) => {
    const eventDate = new Date(ticket.order_item?.order?.event?.start_date);
    const now = new Date();

    if (filter === 'upcoming') return eventDate > now;
    if (filter === 'past') return eventDate < now;
    return true;
  });

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-dark-900 mb-2">My Tickets</h1>
          <p className="text-gray-600">View and manage your event tickets</p>
        </div>

        {/* Filter Tabs */}
        <div className="bg-white rounded-lg shadow-sm p-1 mb-6 inline-flex">
          <button
            onClick={() => setFilter('all')}
            className={`px-6 py-2 rounded-md font-medium transition-colors ${
              filter === 'all'
                ? 'bg-primary-600 text-white'
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            All Tickets ({tickets.length})
          </button>
          <button
            onClick={() => setFilter('upcoming')}
            className={`px-6 py-2 rounded-md font-medium transition-colors ${
              filter === 'upcoming'
                ? 'bg-primary-600 text-white'
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            Upcoming
          </button>
          <button
            onClick={() => setFilter('past')}
            className={`px-6 py-2 rounded-md font-medium transition-colors ${
              filter === 'past'
                ? 'bg-primary-600 text-white'
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            Past Events
          </button>
        </div>

        {filteredTickets.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredTickets.map((ticket) => (
              <TicketCard key={ticket.id} ticket={ticket} />
            ))}
          </div>
        ) : (
          <div className="text-center py-12 bg-white rounded-xl">
            <Ticket className="h-16 w-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-900 mb-2">No tickets found</h3>
            <p className="text-gray-600 mb-6">
              {filter === 'all'
                ? "You haven't purchased any tickets yet"
                : `No ${filter} tickets`}
            </p>
            <a href="/events" className="btn-primary inline-block">
              Browse Events
            </a>
          </div>
        )}
      </div>
    </div>
  );
}

function TicketCard({ ticket }) {
  const [showQR, setShowQR] = useState(false);

  // Since we don't have the event details directly, we'll need to handle this
  const eventTitle = ticket.event_title || 'Event';
  const ticketTypeName = ticket.ticket_type_name || ticket.order_item?.ticket_type?.name || 'Ticket';

  return (
    <div className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-xl transition-shadow">
      {/* Ticket Header */}
      <div className="bg-gradient-to-r from-primary-600 to-primary-700 p-6 text-white">
        <div className="flex justify-between items-start mb-4">
          <Ticket className="h-8 w-8" />
          <span
            className={`px-3 py-1 rounded-full text-xs font-semibold ${
              ticket.status === 'valid'
                ? 'bg-green-500'
                : ticket.status === 'used'
                ? 'bg-gray-500'
                : 'bg-red-500'
            }`}
          >
            {ticket.status.toUpperCase()}
          </span>
        </div>
        <h3 className="font-bold text-xl mb-1">{eventTitle}</h3>
        <p className="text-primary-100 text-sm">{ticketTypeName}</p>
      </div>

      {/* Ticket Body */}
      <div className="p-6 space-y-4">
        <div className="text-sm text-gray-600">
          <p className="font-semibold text-dark-900 mb-1">Ticket Number</p>
          <p className="font-mono">{ticket.ticket_number}</p>
        </div>

        {ticket.attendee_name && (
          <div className="text-sm text-gray-600">
            <p className="font-semibold text-dark-900 mb-1">Attendee</p>
            <p>{ticket.attendee_name}</p>
          </div>
        )}

        {ticket.checked_in && (
          <div className="bg-green-50 border border-green-200 rounded-lg p-3">
            <p className="text-sm text-green-800 font-medium">
              Checked in at {format(new Date(ticket.checked_in_at), 'MMM dd, yyyy h:mm a')}
            </p>
          </div>
        )}

        {/* QR Code Section */}
        <div className="pt-4 border-t">
          <button
            onClick={() => setShowQR(!showQR)}
            className="w-full flex items-center justify-center space-x-2 text-primary-600 hover:text-primary-700 font-medium"
          >
            <QrCode className="h-5 w-5" />
            <span>{showQR ? 'Hide' : 'Show'} QR Code</span>
          </button>

          {showQR && ticket.qr_code && (
            <div className="mt-4 flex justify-center">
              <img
                src={ticket.qr_code}
                alt="Ticket QR Code"
                className="w-48 h-48 border-2 border-gray-200 rounded-lg"
              />
            </div>
          )}
        </div>

        <button 
          onClick={() => downloadTicket(ticket)}
          className="w-full btn-outline text-sm py-2 flex items-center justify-center space-x-2"
        >
          <Download className="h-4 w-4" />
          <span>Download Ticket</span>
        </button>
      </div>
    </div>
  );
}