import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { CreditCard, Phone, Mail } from 'lucide-react';
import { ordersAPI } from '../services/api';
import useCartStore from '../store/cartStore';
import useAuthStore from '../store/authStore';
import toast from 'react-hot-toast';

export default function Checkout() {
  const navigate = useNavigate();
  const { user } = useAuthStore();
  const { items, event, getTotal, getTotalTickets, clearCart } = useCartStore();
  
  const [formData, setFormData] = useState({
    email: user?.email || '',
    phone_number: user?.phone_number || '',
    payment_method: 'mpesa',
  });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (items.length === 0) {
      navigate('/events');
    }
  }, [items, navigate]);

  useEffect(() => {
    if (user) {
      setFormData({
        email: user.email || '',
        phone_number: user.phone_number || '',
        payment_method: 'mpesa',
      });
    }
  }, [user]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    console.log('Starting order creation...');

    try {
      const orderData = {
        event_id: event.id,
        email: formData.email,
        phone_number: formData.phone_number,
        payment_method: formData.payment_method,
        items: items.map((item) => ({
          ticket_type_id: item.ticket_type.id,
          quantity: item.quantity,
        })),
      };

      console.log('📦 Order data:', orderData);

      const response = await ordersAPI.createOrder(orderData);
      
      console.log('✅ Full response:', response.data);

      // Check if we got valid data
      if (!response.data || !response.data.order_number) {
        console.error('❌ Invalid response - missing order_number:', response.data);
        toast.error('Order created but missing details. Please check My Orders.');
        navigate('/orders');
        return;
      }
      console.log('🔄 Navigating to payment with:', {
        orderNumber: response.data.order_number,
        amount: response.data.total_amount,
        phoneNumber: formData.phone_number,
      });

      navigate('/payment-process', {
        state: {
          orderNumber: response.data.order_number,
          amount: response.data.total_amount,
          phoneNumber: formData.phone_number,
        },
        replace: true
      });
      setTimeout(() => clearCart(), 100);

    } catch (error) {
      console.error('❌ Order creation failed:', error);
      console.error('Error response:', error.response?.data);
      const errorMessage = error.response?.data?.error || error.response?.data?.detail || 'Failed to create order';
      toast.error(errorMessage);
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="text-3xl font-bold text-dark-900 mb-8">Checkout</h1>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            <form onSubmit={handleSubmit} className="bg-white rounded-xl shadow-md p-6 space-y-6">
              <div>
                <h2 className="text-xl font-bold text-dark-900 mb-4">Contact Information</h2>
                
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      <Mail className="inline h-4 w-4 mr-1" />
                      Email Address *
                    </label>
                    <input
                      type="email"
                      required
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      className="input-field"
                      placeholder="your@email.com"
                    />
                    {user?.email && (
                      <p className="text-xs text-gray-500 mt-1">
                        Using your account email. You can change it if needed.
                      </p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      <Phone className="inline h-4 w-4 mr-1" />
                      Phone Number *
                    </label>
                    <input
                      type="tel"
                      required
                      value={formData.phone_number}
                      onChange={(e) => setFormData({ ...formData, phone_number: e.target.value })}
                      className="input-field"
                      placeholder="+254712345678"
                    />
                    {user?.phone_number && (
                      <p className="text-xs text-gray-500 mt-1">
                        Using your account phone number. You can change it if needed.
                      </p>
                    )}
                  </div>
                </div>
              </div>

              <div>
                <h2 className="text-xl font-bold text-dark-900 mb-4">Payment Method</h2>
                
                <div className="space-y-3">
                  <label className="flex items-center p-4 border-2 border-primary-500 bg-primary-50 rounded-lg cursor-pointer">
                    <input
                      type="radio"
                      name="payment_method"
                      value="mpesa"
                      checked={formData.payment_method === 'mpesa'}
                      onChange={(e) => setFormData({ ...formData, payment_method: e.target.value })}
                      className="mr-3"
                    />
                    <div className="flex items-center space-x-3 flex-1">
                      <Phone className="h-6 w-6 text-green-600" />
                      <div>
                        <p className="font-semibold text-dark-900">M-Pesa</p>
                        <p className="text-sm text-gray-600">Pay via Lipa na M-Pesa</p>
                      </div>
                    </div>
                  </label>

                  <label className="flex items-center p-4 border-2 border-gray-200 rounded-lg cursor-not-allowed opacity-50">
                    <input
                      type="radio"
                      name="payment_method"
                      value="card"
                      disabled
                      className="mr-3"
                    />
                    <div className="flex items-center space-x-3 flex-1">
                      <CreditCard className="h-6 w-6 text-blue-600" />
                      <div>
                        <p className="font-semibold text-dark-900">Card Payment</p>
                        <p className="text-sm text-gray-600">Coming soon</p>
                      </div>
                    </div>
                  </label>
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full btn-primary disabled:opacity-50 disabled:cursor-not-allowed text-lg py-3"
              >
                {loading ? 'Creating Order...' : `Pay KSh ${getTotal().toLocaleString()}`}
              </button>
            </form>
          </div>

          <div className="lg:col-span-1">
            <div className="bg-white rounded-xl shadow-md p-6 sticky top-20">
              <h3 className="text-xl font-bold text-dark-900 mb-4">Order Summary</h3>
              
              {event && (
                <div className="mb-6 pb-6 border-b">
                  <h4 className="font-semibold text-dark-900 mb-2">{event.title}</h4>
                  <p className="text-sm text-gray-600">{event.venue_name}</p>
                  <p className="text-sm text-gray-600">{event.city}</p>
                </div>
              )}

              <div className="space-y-3 mb-6">
                {items.map((item) => (
                  <div key={item.ticket_type.id} className="flex justify-between text-sm">
                    <span className="text-gray-600">
                      {item.quantity}x {item.ticket_type.name}
                    </span>
                    <span className="font-semibold">
                      KSh {(item.ticket_type.price * item.quantity).toLocaleString()}
                    </span>
                  </div>
                ))}
              </div>

              <div className="border-t pt-4 space-y-2">
                <div className="flex justify-between">
                  <span className="text-gray-600">Subtotal</span>
                  <span className="font-semibold">KSh {getTotal().toLocaleString()}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Total Tickets</span>
                  <span className="font-semibold">{getTotalTickets()}</span>
                </div>
              </div>

              <div className="border-t mt-4 pt-4">
                <div className="flex justify-between items-center">
                  <span className="text-lg font-bold text-dark-900">Total</span>
                  <span className="text-2xl font-bold text-primary-600">
                    KSh {getTotal().toLocaleString()}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}