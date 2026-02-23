import { useEffect, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { 
  ShoppingBag, 
  Calendar, 
  MapPin, 
  Mail, 
  Phone, 
  CreditCard, 
  Download,
  CheckCircle,
  Clock,
  XCircle,
  AlertCircle
} from 'lucide-react';
import { format } from 'date-fns';
import { downloadReceipt } from '../utils/receiptDownload';
import { ordersAPI } from '../services/api';
import toast from 'react-hot-toast';

export default function OrderDetail() {
  const { orderNumber } = useParams();
  const navigate = useNavigate();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [paymentLoading, setPaymentLoading] = useState(false);

  useEffect(() => {
    fetchOrderDetail();
  }, [orderNumber]);

  const fetchOrderDetail = async () => {
    try {
      const response = await ordersAPI.getOrder(orderNumber);
      setOrder(response.data);
    } catch (error) {
      toast.error('Failed to load order details');
      console.error(error);
      navigate('/dashboard');
    } finally {
      setLoading(false);
    }
  };

  const handlePayNow = async () => {
    setPaymentLoading(true);
    try {
      const response = await ordersAPI.initiatePayment(orderNumber, {
        payment_method: order.payment_method,
        phone_number: order.phone_number,
      });
      
      toast.success('Payment request sent! Please check your phone.');
      
      // Poll for payment status (optional)
      setTimeout(() => {
        fetchOrderDetail();
      }, 5000);
    } catch (error) {
      toast.error('Failed to initiate payment');
      console.error(error);
    } finally {
      setPaymentLoading(false);
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'paid':
        return <CheckCircle className="h-8 w-8 text-green-600" />;
      case 'pending':
        return <Clock className="h-8 w-8 text-yellow-600" />;
      case 'cancelled':
        return <XCircle className="h-8 w-8 text-red-600" />;
      case 'refunded':
        return <AlertCircle className="h-8 w-8 text-blue-600" />;
      default:
        return <Clock className="h-8 w-8 text-gray-600" />;
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'paid':
        return 'bg-green-100 text-green-800 border-green-300';
      case 'pending':
        return 'bg-yellow-100 text-yellow-800 border-yellow-300';
      case 'cancelled':
        return 'bg-red-100 text-red-800 border-red-300';
      case 'refunded':
        return 'bg-blue-100 text-blue-800 border-blue-300';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-300';
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  if (!order) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <Link to="/dashboard" className="text-primary-600 hover:text-primary-700 font-medium mb-4 inline-block">
            ← Back to Dashboard
          </Link>
          <div className="flex items-start justify-between">
            <div>
              <h1 className="text-3xl font-bold text-dark-900 mb-2">Order Details</h1>
              <p className="text-gray-600">Order #{order.order_number}</p>
            </div>
            {getStatusIcon(order.status)}
          </div>
        </div>

        {/* Status Banner */}
        <div className={`border-2 rounded-xl p-6 mb-8 ${getStatusColor(order.status)}`}>
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-xl font-bold mb-1">
                {order.status === 'paid' && 'Payment Successful!'}
                {order.status === 'pending' && 'Payment Pending'}
                {order.status === 'cancelled' && 'Order Cancelled'}
                {order.status === 'refunded' && 'Order Refunded'}
              </h3>
              <p className="text-sm">
                {order.status === 'paid' && 'Your tickets are ready in My Tickets'}
                {order.status === 'pending' && 'Complete payment to receive your tickets'}
                {order.status === 'cancelled' && 'This order has been cancelled'}
                {order.status === 'refunded' && 'Amount has been refunded to your account'}
              </p>
            </div>
            {order.status === 'pending' && (
              <button
                onClick={handlePayNow}
                disabled={paymentLoading}
                className="btn-primary disabled:opacity-50"
              >
                {paymentLoading ? 'Processing...' : 'Pay Now'}
              </button>
            )}
            {order.status === 'paid' && (
              <Link to="/my-tickets" className="btn-secondary">
                View Tickets
              </Link>
            )}
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Event Information */}
            <div className="bg-white rounded-xl shadow-md p-6">
              <h2 className="text-xl font-bold text-dark-900 mb-4">Event Details</h2>
              
              {order.event && (
                <div className="space-y-4">
                  <div>
                    <h3 className="text-2xl font-bold text-dark-900 mb-2">{order.event.title}</h3>
                    {order.event.category && (
                      <span className="inline-block bg-primary-100 text-primary-800 px-3 py-1 rounded-full text-sm font-semibold">
                        {order.event.category.name}
                      </span>
                    )}
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-4">
                    <div className="flex items-start space-x-3">
                      <Calendar className="h-5 w-5 text-primary-600 mt-1" />
                      <div>
                        <p className="font-semibold text-dark-900">Date & Time</p>
                        <p className="text-sm text-gray-600">
                          {format(new Date(order.event.start_date), 'EEEE, MMMM dd, yyyy')}
                        </p>
                        <p className="text-sm text-gray-600">
                          {format(new Date(order.event.start_date), 'h:mm a')}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-start space-x-3">
                      <MapPin className="h-5 w-5 text-primary-600 mt-1" />
                      <div>
                        <p className="font-semibold text-dark-900">Venue</p>
                        <p className="text-sm text-gray-600">{order.event.venue_name}</p>
                        <p className="text-sm text-gray-600">{order.event.city}</p>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Order Items */}
            <div className="bg-white rounded-xl shadow-md p-6">
              <h2 className="text-xl font-bold text-dark-900 mb-4">Tickets Ordered</h2>
              
              <div className="space-y-3">
                {order.items && order.items.map((item) => (
                  <div key={item.id} className="border-2 border-gray-200 rounded-lg p-4">
                    <div className="flex justify-between items-start mb-2">
                      <div>
                        <h3 className="font-bold text-dark-900">{item.ticket_type.name}</h3>
                        {item.ticket_type.description && (
                          <p className="text-sm text-gray-600 mt-1">{item.ticket_type.description}</p>
                        )}
                      </div>
                      <div className="text-right">
                        <p className="font-bold text-dark-900">
                          KSh {parseFloat(item.price).toLocaleString()}
                        </p>
                        <p className="text-sm text-gray-600">per ticket</p>
                      </div>
                    </div>
                    
                    <div className="flex justify-between items-center pt-3 border-t">
                      <span className="text-gray-600">Quantity: {item.quantity}</span>
                      <span className="font-bold text-primary-600">
                        KSh {parseFloat(item.subtotal).toLocaleString()}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Contact & Payment Info */}
            <div className="bg-white rounded-xl shadow-md p-6">
              <h2 className="text-xl font-bold text-dark-900 mb-4">Contact & Payment Information</h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="flex items-start space-x-3">
                  <Mail className="h-5 w-5 text-primary-600 mt-1" />
                  <div>
                    <p className="font-semibold text-dark-900">Email</p>
                    <p className="text-sm text-gray-600">{order.email}</p>
                  </div>
                </div>

                <div className="flex items-start space-x-3">
                  <Phone className="h-5 w-5 text-primary-600 mt-1" />
                  <div>
                    <p className="font-semibold text-dark-900">Phone Number</p>
                    <p className="text-sm text-gray-600">{order.phone_number}</p>
                  </div>
                </div>

                <div className="flex items-start space-x-3">
                  <CreditCard className="h-5 w-5 text-primary-600 mt-1" />
                  <div>
                    <p className="font-semibold text-dark-900">Payment Method</p>
                    <p className="text-sm text-gray-600 capitalize">{order.payment_method}</p>
                  </div>
                </div>

                {order.transaction_id && (
                  <div className="flex items-start space-x-3">
                    <CheckCircle className="h-5 w-5 text-green-600 mt-1" />
                    <div>
                      <p className="font-semibold text-dark-900">Transaction ID</p>
                      <p className="text-sm text-gray-600 font-mono">{order.transaction_id}</p>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-1">
            {/* Order Summary - Sticky */}
            <div className="bg-white rounded-xl shadow-md p-6 sticky top-20">
              <h3 className="text-lg font-bold text-dark-900 mb-4">Order Summary</h3>
              
              <div className="space-y-3 mb-6">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Total Tickets</span>
                  <span className="font-semibold">{order.total_tickets}</span>
                </div>
                
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Subtotal</span>
                  <span className="font-semibold">KSh {parseFloat(order.total_amount).toLocaleString()}</span>
                </div>
              </div>

              <div className="border-t pt-4 mb-6">
                <div className="flex justify-between items-center">
                  <span className="text-lg font-bold text-dark-900">Total Paid</span>
                  <span className="text-2xl font-bold text-primary-600">
                    KSh {parseFloat(order.total_amount).toLocaleString()}
                  </span>
                </div>
              </div>

              <div className="space-y-3 text-sm text-gray-600">
                <div className="flex justify-between">
                  <span>Order Date</span>
                  <span className="font-medium">{format(new Date(order.created_at), 'MMM dd, yyyy')}</span>
                </div>
                
                {order.paid_at && (
                  <div className="flex justify-between">
                    <span>Payment Date</span>
                    <span className="font-medium">{format(new Date(order.paid_at), 'MMM dd, yyyy')}</span>
                  </div>
                )}
              </div>

              <div className="mt-6 pt-6 border-t space-y-3">
                {order.status === 'paid' && (
                  <>
                    <Link to="/my-tickets" className="w-full btn-primary block text-center">
                      View My Tickets
                    </Link>
                    <button 
                      onClick={() => downloadReceipt(order)}
                      className="w-full btn-outline flex items-center justify-center space-x-2"
                    >
                      <Download className="h-4 w-4" />
                      <span>Download Receipt</span>
                    </button>
                  </>
                )}
                
                {order.status === 'pending' && (
                  <>
                    <Link
                      to={`/orders/${orderNumber}/manual-payment`}
                      className="w-full btn-primary block text-center"
                    >
                      Submit Payment Proof
                    </Link>
                    <p className="text-xs text-center text-gray-600">
                      Already made payment? Submit your transaction code
                    </p>
                  </>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}