from django.urls import path
from .views import (
    OrderCreateView,
    OrderListView,
    OrderDetailView,
    MyTicketsView,
    TicketDetailView,
    PaymentCallbackView,
    InitiatePaymentView
)

urlpatterns = [
    path('', OrderListView.as_view(), name='order_list'),
    path('create/', OrderCreateView.as_view(), name='order_create'),
    path('<str:order_number>/', OrderDetailView.as_view(), name='order_detail'),
    path('tickets/', MyTicketsView.as_view(), name='my_tickets'),  # Add this
    path('tickets/<str:ticket_number>/', TicketDetailView.as_view(), name='ticket_detail'),
    path('<str:order_number>/pay/', InitiatePaymentView.as_view(), name='initiate_payment'),
    path('payment/callback/', PaymentCallbackView.as_view(), name='payment_callback'),
]