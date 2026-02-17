import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Search, TrendingUp, Calendar, Users } from 'lucide-react';
import { eventsAPI } from '../services/api';
import EventCard from '../components/EventCard';
import toast from 'react-hot-toast';

export default function Home() {
  const [featuredEvents, setFeaturedEvents] = useState([]);
  const [upcomingEvents, setUpcomingEvents] = useState([]);
  const [categories, setCategories] = useState([]);
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchHomeData();
  }, []);

  const fetchHomeData = async () => {
    try {
      const [featuredRes, upcomingRes, categoriesRes, statsRes] = await Promise.all([
        eventsAPI.getFeaturedEvents(),
        eventsAPI.getEvents({ upcoming: true, page_size: 8 }),
        eventsAPI.getCategories(),
        eventsAPI.getEventStats(),
      ]);

      setFeaturedEvents(featuredRes.data);
      setUpcomingEvents(upcomingRes.data.results || upcomingRes.data);
      setCategories(categoriesRes.data);
      setStats(statsRes.data);
    } catch (error) {
      toast.error('Failed to load events');
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen">
      {/* Hero Section with Background Image */}
      <section 
        className="relative bg-gradient-to-br from-primary-600 via-primary-700 to-primary-800 text-white py-20 bg-cover bg-center"
        style={{
          backgroundImage: `linear-gradient(rgba(225, 29, 72, 0.85), rgba(190, 18, 60, 0.85)), url('/src/assets/images/image1.jpg')`,
          backgroundBlendMode: 'multiply'
        }}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="text-center space-y-6">
            <h1 className="text-5xl md:text-6xl font-bold drop-shadow-lg">
              Discover Amazing Events
            </h1>
            <p className="text-xl md:text-2xl text-primary-100 max-w-3xl mx-auto drop-shadow-md">
              Find and book tickets for concerts, sports, comedy shows, and more in Kenya
            </p>
            
            <div className="max-w-2xl mx-auto mt-8">
              <Link to="/events" className="block">
                <div className="bg-white rounded-full p-2 flex items-center shadow-xl hover:shadow-2xl transition-shadow">
                  <input
                    type="text"
                    placeholder="Search for events, artists, or venues..."
                    className="flex-1 px-4 py-2 text-gray-900 bg-transparent outline-none"
                    onClick={(e) => e.preventDefault()}
                  />
                  <button className="bg-secondary-500 hover:bg-secondary-600 text-white px-6 py-2 rounded-full font-semibold flex items-center space-x-2 transition-colors">
                    <Search className="h-5 w-5" />
                    <span>Search</span>
                  </button>
                </div>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {stats && (
        <section className="py-12 bg-gray-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="bg-white rounded-xl p-6 text-center shadow-md">
                <Calendar className="h-12 w-12 text-primary-600 mx-auto mb-3" />
                <p className="text-3xl font-bold text-dark-900">{stats.total_events}</p>
                <p className="text-gray-600">Total Events</p>
              </div>
              <div className="bg-white rounded-xl p-6 text-center shadow-md">
                <TrendingUp className="h-12 w-12 text-secondary-500 mx-auto mb-3" />
                <p className="text-3xl font-bold text-dark-900">{stats.upcoming_events}</p>
                <p className="text-gray-600">Upcoming Events</p>
              </div>
              <div className="bg-white rounded-xl p-6 text-center shadow-md">
                <Users className="h-12 w-12 text-primary-600 mx-auto mb-3" />
                <p className="text-3xl font-bold text-dark-900">{stats.categories_count}</p>
                <p className="text-gray-600">Categories</p>
              </div>
            </div>
          </div>
        </section>
      )}

      {categories.length > 0 && (
        <section className="py-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="text-3xl font-bold text-dark-900 mb-8">Browse by Category</h2>
            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
              {categories.map((category) => (
                <Link
                  key={category.id}
                  to={`/events?category=${category.id}`}
                  className="bg-white rounded-lg p-6 text-center hover:shadow-lg transition-shadow border-2 border-transparent hover:border-primary-500"
                >
                  <div className="text-4xl mb-2">{category.icon || '🎉'}</div>
                  <p className="font-semibold text-dark-900">{category.name}</p>
                  <p className="text-xs text-gray-500 mt-1">{category.events_count} events</p>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}

      {featuredEvents.length > 0 && (
        <section className="py-16 bg-gray-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between items-center mb-8">
              <h2 className="text-3xl font-bold text-dark-900">Featured Events</h2>
              <Link to="/events?featured=true" className="text-primary-600 hover:text-primary-700 font-semibold">
                View All →
              </Link>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {featuredEvents.slice(0, 6).map((event) => (
                <EventCard key={event.id} event={event} />
              ))}
            </div>
          </div>
        </section>
      )}

      {upcomingEvents.length > 0 && (
        <section className="py-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between items-center mb-8">
              <h2 className="text-3xl font-bold text-dark-900">Upcoming Events</h2>
              <Link to="/events" className="text-primary-600 hover:text-primary-700 font-semibold">
                View All →
              </Link>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {upcomingEvents.slice(0, 8).map((event) => (
                <EventCard key={event.id} event={event} />
              ))}
            </div>
          </div>
        </section>
      )}

      <section className="py-20 bg-gradient-to-r from-primary-600 to-secondary-600 text-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-4xl font-bold mb-4">Ready to Host Your Event?</h2>
          <p className="text-xl mb-8">
            Join thousands of organizers using TicketHub to sell tickets and manage events
          </p>
          <Link
            to="/organizer/register"
            className="inline-block bg-white text-primary-600 font-bold py-3 px-8 rounded-lg hover:bg-gray-100 transition-colors"
          >
            Become an Organizer
          </Link>
        </div>
      </section>
    </div>
  );
}
