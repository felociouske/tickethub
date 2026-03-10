import os
import django

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'backend.settings')
django.setup()

from orders.models import Order
from orders.serializers import OrderSerializer

# Get the most recent order
order = Order.objects.select_related('event', 'user').prefetch_related('items__ticket_type').first()

if order:
    print("Order found:", order.order_number)
    serializer = OrderSerializer(order)
    print("\nSerialized data:")
    print(serializer.data)
else:
    print("No orders in database")