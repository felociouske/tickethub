import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { ShoppingBag, Ticket, Calendar, TrendingUp, Eye } from 'lucide-react';
import { format } from 'date-fns';
import { ordersAPI } from '../services/api';
import toast from 'react-hot-toast';

export default function Dashboard() {
  const [orders, setOrders] = useState([]);
  const [tickets, setTickets] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      const [ordersRes, ticketsRes] = await Promise.all([
        ordersAPI.getOrders(),
        ordersAPI.getMyTickets(),
      ]);
      setOrders(ordersRes.data);
      setTickets(ticketsRes.data);
    } catch (error) {
      toast.error('Failed to load dashboard data');
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const stats = {
    totalOrders: orders.length,
    totalTickets: tickets.length,
    upcomingEvents: tickets.filter((t) => {
      const eventDate = new Date(t.order_item?.order?.event?.start_date || new Date());
      return eventDate > new Date();
    }).length,
    totalSpent: orders.reduce((sum, order) => sum + parseFloat(order.total_amount || 0), 0),
  };

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
          <h1 className="text-3xl font-bold text-dark-900 mb-2">My Dashboard</h1>
          <p className="text-gray-600">Track your tickets and orders</p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <StatCard
            icon={<ShoppingBag className="h-8 w-8 text-primary-600" />}
            title="Total Orders"
            value={stats.totalOrders}
            bgColor="bg-primary-50"
          />
          <StatCard
            icon={<Ticket className="h-8 w-8 text-secondary-600" />}
            title="Total Tickets"
            value={stats.totalTickets}
            bgColor="bg-secondary-50"
          />
          <StatCard
            icon={<Calendar className="h-8 w-8 text-green-600" />}
            title="Upcoming Events"
            value={stats.upcomingEvents}
            bgColor="bg-green-50"
          />
          <StatCard
            icon={<TrendingUp className="h-8 w-8 text-blue-600" />}
            title="Total Spent"
            value={`KSh ${stats.totalSpent.toLocaleString()}`}
            bgColor="bg-blue-50"
          />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Recent Orders */}
          <div className="bg-white rounded-xl shadow-md p-6">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-bold text-dark-900">Recent Orders</h2>
              <Link to="/orders" className="text-primary-600 hover:text-primary-700 text-sm font-medium">
                View All
              </Link>
            </div>

            {orders.length > 0 ? (
              <div className="space-y-4">
                {orders.slice(0, 5).map((order) => (
                  <OrderCard key={order.id} order={order} />
                ))}
              </div>
            ) : (
              <div className="text-center py-8">
                <ShoppingBag className="h-12 w-12 text-gray-400 mx-auto mb-3" />
                <p className="text-gray-600">No orders yet</p>
                <Link to="/events" className="text-primary-600 hover:text-primary-700 text-sm font-medium mt-2 inline-block">
                  Browse Events
                </Link>
              </div>
            )}
          </div>

          {/* Recent Tickets */}
          <div className="bg-white rounded-xl shadow-md p-6">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-bold text-dark-900">Recent Tickets</h2>
              <Link to="/my-tickets" className="text-primary-600 hover:text-primary-700 text-sm font-medium">
                View All
              </Link>
            </div>

            {tickets.length > 0 ? (
              <div className="space-y-4">
                {tickets.slice(0, 5).map((ticket) => (
                  <TicketCard key={ticket.id} ticket={ticket} />
                ))}
              </div>
            ) : (
              <div className="text-center py-8">
                <Ticket className="h-12 w-12 text-gray-400 mx-auto mb-3" />
                <p className="text-gray-600">No tickets yet</p>
                <Link to="/events" className="text-primary-600 hover:text-primary-700 text-sm font-medium mt-2 inline-block">
                  Get Tickets
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

function StatCard({ icon, title, value, bgColor }) {
  return (
    <div className={`${bgColor} rounded-xl p-6`}>
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm text-gray-600 mb-1">{title}</p>
          <p className="text-2xl font-bold text-dark-900">{value}</p>
        </div>
        <div>{icon}</div>
      </div>
    </div>
  );
}

function OrderCard({ order }) {
  const getStatusColor = (status) => {
    switch (status) {
      case 'paid':
        return 'bg-green-100 text-green-800';
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'cancelled':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <Link
      to={`/orders/${order.order_number}`}
      className="block border-2 border-gray-200 rounded-lg p-4 hover:border-primary-500 transition-colors"
    >
      <div className="flex justify-between items-start mb-2">
        <div>
          <p className="font-semibold text-dark-900">{order.event?.title || 'Event'}</p>
          <p className="text-sm text-gray-600">Order #{order.order_number}</p>
        </div>
        <span className={`px-3 py-1 rounded-full text-xs font-semibold ${getStatusColor(order.status)}`}>
          {order.status.toUpperCase()}
        </span>
      </div>
      <div className="flex justify-between items-center text-sm">
        <span className="text-gray-600">
          {format(new Date(order.created_at), 'MMM dd, yyyy')}
        </span>
        <span className="font-bold text-primary-600">
          KSh {parseFloat(order.total_amount).toLocaleString()}
        </span>
      </div>
    </Link>
  );
}

function TicketCard({ ticket }) {
  return (
    <div className="border-2 border-gray-200 rounded-lg p-4">
      <div className="flex items-start justify-between mb-2">
        <div className="flex items-start space-x-3">
          <Ticket className="h-5 w-5 text-primary-600 mt-0.5" />
          <div>
            <p className="font-semibold text-dark-900 text-sm">
              {ticket.event_title || 'Event'}
            </p>
            <p className="text-xs text-gray-600">{ticket.ticket_type_name}</p>
          </div>
        </div>
        <span
          className={`px-2 py-1 rounded-full text-xs font-semibold ${
            ticket.status === 'valid'
              ? 'bg-green-100 text-green-800'
              : 'bg-gray-100 text-gray-800'
          }`}
        >
          {ticket.status}
        </span>
      </div>
      <p className="text-xs text-gray-500 font-mono">{ticket.ticket_number}</p>
    </div>
  );
}