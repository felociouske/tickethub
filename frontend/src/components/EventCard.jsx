import { Link } from 'react-router-dom';
import { Calendar, MapPin, Tag } from 'lucide-react';
import { format } from 'date-fns';

export default function EventCard({ event }) {
  const formatDate = (dateString) => {
    return format(new Date(dateString), 'MMM dd, yyyy');
  };

  const formatTime = (dateString) => {
    return format(new Date(dateString), 'h:mm a');
  };

  return (
    <Link to={`/events/${event.slug}`} className="card group">
      <div className="relative overflow-hidden h-48">
        {event.thumbnail_image ? (
          <img
            src={event.thumbnail_image}
            alt={event.title}
            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
          />
        ) : (
          <div className="w-full h-full bg-gradient-to-br from-primary-500 to-secondary-500 flex items-center justify-center">
            <Calendar className="h-16 w-16 text-white opacity-50" />
          </div>
        )}
        
        {event.is_featured && (
          <div className="absolute top-3 right-3 bg-secondary-500 text-white px-3 py-1 rounded-full text-xs font-semibold">
            Featured
          </div>
        )}
      </div>

      <div className="p-4">
        <div className="flex items-center space-x-2 text-sm text-gray-500 mb-2">
          <Tag className="h-4 w-4" />
          <span>{event.category?.name || 'General'}</span>
        </div>

        <h3 className="font-bold text-lg text-dark-900 mb-2 line-clamp-2 group-hover:text-primary-600 transition-colors">
          {event.title}
        </h3>

        <div className="space-y-2 text-sm text-gray-600">
          <div className="flex items-center space-x-2">
            <Calendar className="h-4 w-4 text-primary-600" />
            <span>{formatDate(event.start_date)} at {formatTime(event.start_date)}</span>
          </div>
          
          <div className="flex items-center space-x-2">
            <MapPin className="h-4 w-4 text-primary-600" />
            <span className="line-clamp-1">{event.venue_name}, {event.city}</span>
          </div>
        </div>

        <div className="mt-4 pt-4 border-t flex items-center justify-between">
          {event.min_price ? (
            <div>
              <span className="text-xs text-gray-500">From</span>
              <p className="text-xl font-bold text-primary-600">
                KSh {parseFloat(event.min_price).toLocaleString()}
              </p>
            </div>
          ) : (
            <p className="text-gray-500">Price TBA</p>
          )}
          
          {event.tickets_available ? (
            <span className="bg-green-100 text-green-800 text-xs font-semibold px-3 py-1 rounded-full">
              Available
            </span>
          ) : (
            <span className="bg-red-100 text-red-800 text-xs font-semibold px-3 py-1 rounded-full">
              Sold Out
            </span>
          )}
        </div>
      </div>
    </Link>
  );
}