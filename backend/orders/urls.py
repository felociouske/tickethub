from django.urls import path
from .views import (
    OrderCreateView,
    OrderListView,
    OrderDetailView,
    MyTicketsView,
    TicketDetailView,
    PaymentCallbackView,
    InitiatePaymentView,
    SubmitPaymentProofView,
    CheckPaymentStatusView,
)

urlpatterns = [
    # Order endpoints
    path('', OrderListView.as_view(), name='order_list'),
    path('create/', OrderCreateView.as_view(), name='order_create'),
    
    # Ticket endpoints
    path('tickets/', MyTicketsView.as_view(), name='my_tickets'),
    path('tickets/<str:ticket_number>/', TicketDetailView.as_view(), name='ticket_detail'),
    
    # Order detail and payment
    path('<str:order_number>/', OrderDetailView.as_view(), name='order_detail'),
    path('<str:order_number>/pay/', InitiatePaymentView.as_view(), name='initiate_payment'),
    
    # Payment proof endpoints - NEW
    path('<str:order_number>/submit-payment/', SubmitPaymentProofView.as_view(), name='submit_payment'),
    path('<str:order_number>/payment-status/', CheckPaymentStatusView.as_view(), name='payment_status'),
    
    # Payment callback
    path('payment/callback/', PaymentCallbackView.as_view(), name='payment_callback'),
]