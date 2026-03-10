from rest_framework import generics, status
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework.views import APIView
from django.shortcuts import get_object_or_404
from .models import Order, Ticket, Payment
from .serializers import (
    OrderSerializer,
    OrderCreateSerializer,
    TicketSerializer,
    PaymentSerializer
)

class OrderCreateView(generics.CreateAPIView):
    """
    API endpoint to create a new order.
    Validates ticket availability and creates order with items.
    """
    queryset = Order.objects.all()
    serializer_class = OrderCreateSerializer
    permission_classes = [IsAuthenticated]
    
    def perform_create(self, serializer):
        return serializer.save(user=self.request.user)
    
    def create(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        
        # Create the order
        order = self.perform_create(serializer)
        
        # CRITICAL FIX: Refresh the order from database to get related data
        order.refresh_from_db()
        
        # Use select_related and prefetch_related for efficient querying
        order = Order.objects.select_related(
            'event', 
            'user'
        ).prefetch_related(
            'items__ticket_type'
        ).get(id=order.id)
        
        # Return order details with order serializer
        response_serializer = OrderSerializer(order)
        return Response(response_serializer.data, status=status.HTTP_201_CREATED)


class OrderListView(generics.ListAPIView):
    """
    API endpoint to list user's orders.
    """
    serializer_class = OrderSerializer
    permission_classes = [IsAuthenticated]
    
    def get_queryset(self):
        return Order.objects.filter(user=self.request.user).select_related(
            'event'
        ).prefetch_related('items__ticket_type')


class OrderDetailView(generics.RetrieveAPIView):
    """
    API endpoint to retrieve a specific order by order number.
    """
    serializer_class = OrderSerializer
    permission_classes = [IsAuthenticated]
    lookup_field = 'order_number'
    
    def get_queryset(self):
        return Order.objects.filter(user=self.request.user).select_related(
            'event'
        ).prefetch_related('items__ticket_type')


class MyTicketsView(generics.ListAPIView):
    """
    API endpoint to list all user's tickets from PAID orders only
    """
    serializer_class = TicketSerializer
    permission_classes = [IsAuthenticated]
    
    def get_queryset(self):
        return Ticket.objects.filter(
            order_item__order__user=self.request.user,
            order_item__order__status='paid'  
        ).select_related(
            'order_item__order__event',
            'order_item__order__event__organizer',
            'order_item__ticket_type',
            'order_item__order'
        ).order_by('-created_at')


class TicketDetailView(generics.RetrieveAPIView):
    """
    API endpoint to retrieve a specific ticket by ticket number.
    """
    serializer_class = TicketSerializer
    permission_classes = [IsAuthenticated]
    lookup_field = 'ticket_number'
    
    def get_queryset(self):
        return Ticket.objects.filter(
            order_item__order__user=self.request.user
        )


class PaymentCallbackView(APIView):
    """
    Webhook endpoint for payment gateway callbacks.
    This handles M-Pesa, Stripe, or other payment confirmations.
    """
    permission_classes = []
    
    def post(self, request):
        transaction_id = request.data.get('transaction_id')
        order_number = request.data.get('order_number')
        status_code = request.data.get('status')
        
        try:
            order = Order.objects.get(order_number=order_number)
            
            payment, created = Payment.objects.get_or_create(
                order=order,
                defaults={
                    'payment_method': order.payment_method,
                    'amount': order.total_amount
                }
            )
            
            payment.transaction_id = transaction_id
            payment.raw_response = request.data
            
            if status_code == 'success':
                payment.status = 'completed'
                order.status = 'paid'
                order.transaction_id = transaction_id
                
                from django.utils import timezone
                payment.completed_at = timezone.now()
                order.paid_at = timezone.now()
            else:
                payment.status = 'failed'
                order.status = 'cancelled'
            
            payment.save()
            order.save()
            
            return Response({
                'message': 'Payment status updated successfully'
            }, status=status.HTTP_200_OK)
        
        except Order.DoesNotExist:
            return Response({
                'error': 'Order not found'
            }, status=status.HTTP_404_NOT_FOUND)


class InitiatePaymentView(APIView):
    """
    API endpoint to initiate payment for an order.
    """
    permission_classes = [IsAuthenticated]
    
    def post(self, request, order_number):
        order = get_object_or_404(
            Order,
            order_number=order_number,
            user=request.user
        )
        
        if order.status != 'pending':
            return Response({
                'error': 'Order is not in pending status'
            }, status=status.HTTP_400_BAD_REQUEST)
        
        payment_method = request.data.get('payment_method')
        
        payment = Payment.objects.create(
            order=order,
            payment_method=payment_method,
            amount=order.total_amount,
            phone_number=request.data.get('phone_number', order.phone_number)
        )
        
        return Response({
            'message': 'Payment initiated',
            'payment_id': payment.id,
            'order_number': order.order_number,
            'amount': str(order.total_amount),
        }, status=status.HTTP_200_OK)

class SubmitPaymentProofView(APIView):
    """Submit payment transaction code"""
    permission_classes = [IsAuthenticated]
    
    def post(self, request, order_number):
        from .models import PaymentProof
        
        try:
            order = Order.objects.get(order_number=order_number, user=request.user)
        except Order.DoesNotExist:
            return Response({'error': 'Order not found'}, status=status.HTTP_404_NOT_FOUND)
        
        if order.status != 'pending':
            return Response({'error': 'Order is not pending'}, status=status.HTTP_400_BAD_REQUEST)
        
        transaction_code = request.data.get('transaction_code')
        if not transaction_code:
            return Response({'error': 'Transaction code required'}, status=status.HTTP_400_BAD_REQUEST)
        
        # Check if code already used
        if PaymentProof.objects.filter(transaction_code=transaction_code.upper()).exists():
            return Response({'error': 'Transaction code already submitted'}, status=status.HTTP_400_BAD_REQUEST)
        
        # Create payment proof
        PaymentProof.objects.create(
            order=order,
            transaction_code=transaction_code.upper(),
            phone_number=request.data.get('phone_number', order.phone_number),
            payment_method=order.payment_method,
            amount=order.total_amount,
            status='pending'
        )
        
        return Response({
            'message': 'Payment proof submitted successfully',
            'status': 'pending'
        }, status=status.HTTP_201_CREATED)


class CheckPaymentStatusView(APIView):
    """Check payment verification status"""
    permission_classes = [IsAuthenticated]
    
    def get(self, request, order_number):
        from .models import PaymentProof
        
        try:
            order = Order.objects.get(order_number=order_number, user=request.user)
        except Order.DoesNotExist:
            return Response({'error': 'Order not found'}, status=status.HTTP_404_NOT_FOUND)
        
        payment_proof = order.payment_proofs.first()
        
        if not payment_proof:
            return Response({'status': 'no_proof'})
        
        # If approved, also check if order status is updated
        if payment_proof.status == 'approved':
            order.refresh_from_db()
        
        return Response({
            'status': payment_proof.status,
            'transaction_code': payment_proof.transaction_code,
            'submitted_at': payment_proof.created_at,
            'order_status': order.status,
        })