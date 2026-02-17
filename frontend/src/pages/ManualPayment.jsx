import { useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { Upload, AlertCircle, CheckCircle, Clock } from 'lucide-react';
import toast from 'react-hot-toast';

export default function ManualPayment() {
  const { orderNumber } = useParams();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    transaction_code: '',
    phone_number: '',
    payment_method: 'mpesa',
    notes: '',
  });
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      // For now, just show success message
      // In production, this would call an API endpoint
      toast.success('Payment proof submitted! Waiting for admin approval.');
      
      // Simulate submission
      setTimeout(() => {
        navigate(`/orders/${orderNumber}`);
      }, 2000);
    } catch (error) {
      toast.error('Failed to submit payment proof');
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Back Link */}
        <Link 
          to={`/orders/${orderNumber}`}
          className="text-primary-600 hover:text-primary-700 font-medium mb-6 inline-block"
        >
          ← Back to Order
        </Link>

        {/* Header */}
        <div className="bg-white rounded-xl shadow-md p-6 mb-6">
          <h1 className="text-3xl font-bold text-dark-900 mb-2">Submit Payment Proof</h1>
          <p className="text-gray-600">Order #{orderNumber}</p>
        </div>

        {/* Payment Instructions */}
        <div className="bg-blue-50 border-2 border-blue-200 rounded-xl p-6 mb-6">
          <div className="flex items-start space-x-3">
            <AlertCircle className="h-6 w-6 text-blue-600 mt-0.5" />
            <div>
              <h3 className="font-bold text-blue-900 mb-2">Payment Instructions</h3>
              <ol className="text-sm text-blue-800 space-y-2">
                <li>1. Make payment via M-Pesa to Paybill: <strong>123456</strong></li>
                <li>2. Account Number: <strong>{orderNumber}</strong></li>
                <li>3. You will receive an M-Pesa confirmation SMS</li>
                <li>4. Enter the transaction code from the SMS below</li>
                <li>5. Admin will verify and approve your payment</li>
              </ol>
            </div>
          </div>
        </div>

        {/* Payment Form */}
        <div className="bg-white rounded-xl shadow-md p-6">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                M-Pesa Transaction Code *
              </label>
              <input
                type="text"
                required
                value={formData.transaction_code}
                onChange={(e) => setFormData({ ...formData, transaction_code: e.target.value.toUpperCase() })}
                placeholder="e.g., QAB12CD3EF"
                className="input-field"
                maxLength={10}
              />
              <p className="text-xs text-gray-500 mt-1">
                The code from your M-Pesa confirmation SMS (usually 10 characters)
              </p>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Phone Number Used *
              </label>
              <input
                type="tel"
                required
                value={formData.phone_number}
                onChange={(e) => setFormData({ ...formData, phone_number: e.target.value })}
                placeholder="+254712345678"
                className="input-field"
              />
              <p className="text-xs text-gray-500 mt-1">
                The phone number you used to make the M-Pesa payment
              </p>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Payment Method
              </label>
              <select
                value={formData.payment_method}
                onChange={(e) => setFormData({ ...formData, payment_method: e.target.value })}
                className="input-field"
              >
                <option value="mpesa">M-Pesa</option>
                <option value="bank">Bank Transfer</option>
                <option value="card">Card Payment</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Additional Notes (Optional)
              </label>
              <textarea
                value={formData.notes}
                onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                placeholder="Any additional information about your payment..."
                rows={3}
                className="input-field"
              />
            </div>

            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
              <div className="flex items-start space-x-2">
                <Clock className="h-5 w-5 text-yellow-600 mt-0.5" />
                <div className="text-sm text-yellow-800">
                  <p className="font-semibold mb-1">Verification Process</p>
                  <p>Your payment will be verified by our admin team within 24 hours. You'll receive a confirmation email once approved.</p>
                </div>
              </div>
            </div>

            <div className="flex space-x-4">
              <button
                type="submit"
                disabled={loading}
                className="flex-1 btn-primary disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? 'Submitting...' : 'Submit Payment Proof'}
              </button>
              <Link
                to={`/orders/${orderNumber}`}
                className="flex-1 btn-outline text-center"
              >
                Cancel
              </Link>
            </div>
          </form>
        </div>

        {/* Help Section */}
        <div className="mt-6 bg-white rounded-xl shadow-md p-6">
          <h3 className="font-bold text-dark-900 mb-3">Need Help?</h3>
          <div className="space-y-2 text-sm text-gray-600">
            <p>• Can't find your transaction code? Check your M-Pesa messages</p>
            <p>• Payment not going through? Contact support: support@tickethub.com</p>
            <p>• For urgent issues, call: +254 700 000 000</p>
          </div>
        </div>
      </div>
    </div>
  );
}