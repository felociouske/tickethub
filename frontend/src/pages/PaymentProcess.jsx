import { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Phone, Copy, CheckCircle, Clock, AlertCircle, ArrowRight } from 'lucide-react';
import toast from 'react-hot-toast';

export default function PaymentProcess() {
  const navigate = useNavigate();
  const location = useLocation();
  const { orderNumber, amount, phoneNumber } = location.state || {};
  
  const [step, setStep] = useState(1); // 1: Instructions, 2: Submit Code, 3: Verification
  const [transactionCode, setTransactionCode] = useState('');
  const [paymentStatus, setPaymentStatus] = useState('pending'); // pending, verifying, approved, rejected
  const [loading, setLoading] = useState(false);

  const paybillNumber = '123456'; // Your paybill number
  const accountNumber = orderNumber || 'TH000000';

  useEffect(() => {
    if (!orderNumber || !amount) {
      navigate('/orders');
    }
  }, [orderNumber, amount, navigate]);

  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text);
    toast.success('Copied to clipboard!');
  };

  const handleSubmitCode = async (e) => {
    e.preventDefault();
    
    if (transactionCode.length < 8) {
      toast.error('Please enter a valid transaction code');
      return;
    }

    setLoading(true);
    setPaymentStatus('verifying');

    try {
      // TODO: Call API to submit transaction code
      // const response = await ordersAPI.submitPaymentProof(orderNumber, {
      //   transaction_code: transactionCode,
      //   phone_number: phoneNumber,
      // });

      // Simulate API call
      setTimeout(() => {
        setPaymentStatus('pending');
        setStep(3);
        toast.success('Payment code submitted! Waiting for verification...');
        setLoading(false);
      }, 1500);
    } catch (error) {
      toast.error('Failed to submit payment code');
      setPaymentStatus('pending');
      setLoading(false);
    }
  };

  const checkPaymentStatus = async () => {
    // TODO: Poll for payment status
    // const response = await ordersAPI.checkPaymentStatus(orderNumber);
    // setPaymentStatus(response.data.status);
  };

  useEffect(() => {
    if (step === 3 && paymentStatus === 'pending') {
      // Poll for payment status every 5 seconds
      const interval = setInterval(checkPaymentStatus, 5000);
      return () => clearInterval(interval);
    }
  }, [step, paymentStatus]);

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Progress Steps */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div className={`flex items-center ${step >= 1 ? 'text-primary-600' : 'text-gray-400'}`}>
              <div className={`w-10 h-10 rounded-full flex items-center justify-center ${step >= 1 ? 'bg-primary-600 text-white' : 'bg-gray-300'}`}>
                1
              </div>
              <span className="ml-2 font-medium hidden sm:inline">Instructions</span>
            </div>
            <div className={`flex-1 h-1 mx-4 ${step >= 2 ? 'bg-primary-600' : 'bg-gray-300'}`}></div>
            <div className={`flex items-center ${step >= 2 ? 'text-primary-600' : 'text-gray-400'}`}>
              <div className={`w-10 h-10 rounded-full flex items-center justify-center ${step >= 2 ? 'bg-primary-600 text-white' : 'bg-gray-300'}`}>
                2
              </div>
              <span className="ml-2 font-medium hidden sm:inline">Submit Code</span>
            </div>
            <div className={`flex-1 h-1 mx-4 ${step >= 3 ? 'bg-primary-600' : 'bg-gray-300'}`}></div>
            <div className={`flex items-center ${step >= 3 ? 'text-primary-600' : 'text-gray-400'}`}>
              <div className={`w-10 h-10 rounded-full flex items-center justify-center ${step >= 3 ? 'bg-primary-600 text-white' : 'bg-gray-300'}`}>
                3
              </div>
              <span className="ml-2 font-medium hidden sm:inline">Verification</span>
            </div>
          </div>
        </div>

        {/* Step 1: Payment Instructions */}
        {step === 1 && (
          <div className="bg-white rounded-xl shadow-md p-8 space-y-6">
            <div className="text-center">
              <Phone className="h-16 w-16 text-green-600 mx-auto mb-4" />
              <h1 className="text-3xl font-bold text-dark-900 mb-2">M-Pesa Payment</h1>
              <p className="text-gray-600">Follow these steps to complete your payment</p>
            </div>

            <div className="bg-green-50 border-2 border-green-200 rounded-xl p-6">
              <h3 className="font-bold text-green-900 mb-4 text-lg">Payment Instructions</h3>
              <ol className="space-y-4">
                <li className="flex items-start space-x-3">
                  <span className="flex-shrink-0 w-6 h-6 bg-green-600 text-white rounded-full flex items-center justify-center text-sm font-bold">1</span>
                  <div className="flex-1">
                    <p className="text-green-900 font-medium">Go to M-Pesa menu on your phone</p>
                    <p className="text-green-700 text-sm">SIM Toolkit → M-Pesa → Lipa na M-Pesa → Paybill</p>
                  </div>
                </li>
                <li className="flex items-start space-x-3">
                  <span className="flex-shrink-0 w-6 h-6 bg-green-600 text-white rounded-full flex items-center justify-center text-sm font-bold">2</span>
                  <div className="flex-1">
                    <p className="text-green-900 font-medium">Enter Business Number (Paybill)</p>
                    <div className="flex items-center space-x-2 mt-2 bg-white p-3 rounded-lg border border-green-300">
                      <code className="text-2xl font-bold text-green-900">{paybillNumber}</code>
                      <button
                        onClick={() => copyToClipboard(paybillNumber)}
                        className="ml-auto text-green-600 hover:text-green-700"
                      >
                        <Copy className="h-5 w-5" />
                      </button>
                    </div>
                  </div>
                </li>
                <li className="flex items-start space-x-3">
                  <span className="flex-shrink-0 w-6 h-6 bg-green-600 text-white rounded-full flex items-center justify-center text-sm font-bold">3</span>
                  <div className="flex-1">
                    <p className="text-green-900 font-medium">Enter Account Number</p>
                    <div className="flex items-center space-x-2 mt-2 bg-white p-3 rounded-lg border border-green-300">
                      <code className="text-xl font-bold text-green-900">{accountNumber}</code>
                      <button
                        onClick={() => copyToClipboard(accountNumber)}
                        className="ml-auto text-green-600 hover:text-green-700"
                      >
                        <Copy className="h-5 w-5" />
                      </button>
                    </div>
                  </div>
                </li>
                <li className="flex items-start space-x-3">
                  <span className="flex-shrink-0 w-6 h-6 bg-green-600 text-white rounded-full flex items-center justify-center text-sm font-bold">4</span>
                  <div className="flex-1">
                    <p className="text-green-900 font-medium">Enter Amount</p>
                    <div className="mt-2 bg-white p-3 rounded-lg border border-green-300">
                      <code className="text-2xl font-bold text-green-900">KSh {amount?.toLocaleString()}</code>
                    </div>
                  </div>
                </li>
                <li className="flex items-start space-x-3">
                  <span className="flex-shrink-0 w-6 h-6 bg-green-600 text-white rounded-full flex items-center justify-center text-sm font-bold">5</span>
                  <div className="flex-1">
                    <p className="text-green-900 font-medium">Enter your M-Pesa PIN and confirm</p>
                  </div>
                </li>
                <li className="flex items-start space-x-3">
                  <span className="flex-shrink-0 w-6 h-6 bg-green-600 text-white rounded-full flex items-center justify-center text-sm font-bold">6</span>
                  <div className="flex-1">
                    <p className="text-green-900 font-medium">You will receive an M-Pesa confirmation SMS</p>
                    <p className="text-green-700 text-sm mt-1">Save the transaction code from the SMS</p>
                  </div>
                </li>
              </ol>
            </div>

            <button
              onClick={() => setStep(2)}
              className="w-full btn-primary flex items-center justify-center space-x-2"
            >
              <span>I've Made the Payment</span>
              <ArrowRight className="h-5 w-5" />
            </button>

            <p className="text-center text-sm text-gray-600">
              Having issues? <a href="/help" className="text-primary-600 hover:text-primary-700 font-medium">Contact Support</a>
            </p>
          </div>
        )}

        {/* Step 2: Submit Transaction Code */}
        {step === 2 && (
          <div className="bg-white rounded-xl shadow-md p-8 space-y-6">
            <div className="text-center">
              <CheckCircle className="h-16 w-16 text-primary-600 mx-auto mb-4" />
              <h1 className="text-3xl font-bold text-dark-900 mb-2">Submit Transaction Code</h1>
              <p className="text-gray-600">Enter the M-Pesa confirmation code from your SMS</p>
            </div>

            <form onSubmit={handleSubmitCode} className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  M-Pesa Transaction Code *
                </label>
                <input
                  type="text"
                  value={transactionCode}
                  onChange={(e) => setTransactionCode(e.target.value.toUpperCase())}
                  placeholder="e.g., QAB12CD3EF"
                  className="input-field text-center text-2xl font-bold tracking-wider"
                  maxLength={10}
                  required
                />
                <p className="text-xs text-gray-500 mt-2 text-center">
                  Usually starts with letters like "QAB", "RCF", "QBM" followed by numbers
                </p>
              </div>

              <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                <div className="flex items-start space-x-2">
                  <AlertCircle className="h-5 w-5 text-yellow-600 mt-0.5" />
                  <div className="text-sm text-yellow-800">
                    <p className="font-semibold mb-1">Can't find your code?</p>
                    <p>Check your SMS inbox for a message from M-PESA. The code is usually 10 characters long.</p>
                  </div>
                </div>
              </div>

              <div className="flex space-x-4">
                <button
                  type="button"
                  onClick={() => setStep(1)}
                  className="flex-1 btn-outline"
                >
                  Back
                </button>
                <button
                  type="submit"
                  disabled={loading || transactionCode.length < 8}
                  className="flex-1 btn-primary disabled:opacity-50"
                >
                  {loading ? 'Submitting...' : 'Submit Code'}
                </button>
              </div>
            </form>
          </div>
        )}

        {/* Step 3: Verification Status */}
        {step === 3 && (
          <div className="bg-white rounded-xl shadow-md p-8 space-y-6">
            <PaymentStatusDisplay 
              status={paymentStatus}
              transactionCode={transactionCode}
              orderNumber={orderNumber}
            />
          </div>
        )}
      </div>
    </div>
  );
}

function PaymentStatusDisplay({ status, transactionCode, orderNumber }) {
  const navigate = useNavigate();

  const statusConfig = {
    pending: {
      icon: <Clock className="h-16 w-16 text-yellow-600" />,
      color: 'yellow',
      title: 'Verifying Payment',
      message: 'Your payment is being verified by our team. This usually takes a few minutes.',
    },
    verifying: {
      icon: <Clock className="h-16 w-16 text-blue-600 animate-spin" />,
      color: 'blue',
      title: 'Processing...',
      message: 'Please wait while we verify your transaction.',
    },
    approved: {
      icon: <CheckCircle className="h-16 w-16 text-green-600" />,
      color: 'green',
      title: 'Payment Approved!',
      message: 'Your payment has been verified. Your tickets are ready!',
    },
    rejected: {
      icon: <AlertCircle className="h-16 w-16 text-red-600" />,
      color: 'red',
      title: 'Payment Not Found',
      message: 'We could not verify your transaction. Please check the code or contact support.',
    },
  };

  const config = statusConfig[status];

  return (
    <div className="text-center space-y-6">
      <div className={`bg-${config.color}-50 rounded-full w-24 h-24 flex items-center justify-center mx-auto`}>
        {config.icon}
      </div>

      <div>
        <h1 className="text-3xl font-bold text-dark-900 mb-2">{config.title}</h1>
        <p className="text-gray-600">{config.message}</p>
      </div>

      <div className="bg-gray-50 rounded-lg p-4 space-y-2">
        <div className="flex justify-between text-sm">
          <span className="text-gray-600">Transaction Code:</span>
          <span className="font-bold font-mono">{transactionCode}</span>
        </div>
        <div className="flex justify-between text-sm">
          <span className="text-gray-600">Order Number:</span>
          <span className="font-bold">{orderNumber}</span>
        </div>
      </div>

      {status === 'pending' && (
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <p className="text-sm text-blue-800">
            ⏱️ Verification usually takes 2-5 minutes. You'll receive an email once approved.
          </p>
        </div>
      )}

      {status === 'approved' && (
        <button
          onClick={() => navigate(`/orders/${orderNumber}`)}
          className="btn-primary"
        >
          View My Tickets
        </button>
      )}

      {status === 'rejected' && (
        <div className="flex space-x-4">
          <button
            onClick={() => window.location.reload()}
            className="flex-1 btn-outline"
          >
            Try Again
          </button>
          <button
            onClick={() => navigate('/help')}
            className="flex-1 btn-primary"
          >
            Contact Support
          </button>
        </div>
      )}

      <button
        onClick={() => navigate('/dashboard')}
        className="text-primary-600 hover:text-primary-700 font-medium text-sm"
      >
        Go to Dashboard
      </button>
    </div>
  );
}