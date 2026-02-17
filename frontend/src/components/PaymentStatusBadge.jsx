import { CheckCircle, Clock, XCircle, AlertCircle } from 'lucide-react';

export default function PaymentStatusBadge({ status, showIcon = true }) {
  const getStatusConfig = (status) => {
    switch (status) {
      case 'paid':
      case 'completed':
        return {
          color: 'bg-green-100 text-green-800 border-green-300',
          icon: <CheckCircle className="h-4 w-4" />,
          label: 'Paid',
        };
      case 'pending':
      case 'processing':
        return {
          color: 'bg-yellow-100 text-yellow-800 border-yellow-300',
          icon: <Clock className="h-4 w-4" />,
          label: 'Pending',
        };
      case 'cancelled':
      case 'failed':
        return {
          color: 'bg-red-100 text-red-800 border-red-300',
          icon: <XCircle className="h-4 w-4" />,
          label: 'Cancelled',
        };
      case 'refunded':
        return {
          color: 'bg-blue-100 text-blue-800 border-blue-300',
          icon: <AlertCircle className="h-4 w-4" />,
          label: 'Refunded',
        };
      case 'awaiting_verification':
        return {
          color: 'bg-purple-100 text-purple-800 border-purple-300',
          icon: <Clock className="h-4 w-4" />,
          label: 'Awaiting Verification',
        };
      default:
        return {
          color: 'bg-gray-100 text-gray-800 border-gray-300',
          icon: <Clock className="h-4 w-4" />,
          label: status,
        };
    }
  };

  const config = getStatusConfig(status);

  return (
    <span className={`inline-flex items-center space-x-1 px-3 py-1 rounded-full text-xs font-semibold border ${config.color}`}>
      {showIcon && config.icon}
      <span>{config.label}</span>
    </span>
  );
}