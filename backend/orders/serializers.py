from rest_framework import serializers
from .models import Order, OrderItem, Ticket, Payment
from events.models import Event, TicketType


class TicketTypeSimpleSerializer(serializers.ModelSerializer):
    """Simple serializer for ticket types"""
    class Meta:
        model = TicketType
        fields = ['id', 'name', 'price', 'description']


class EventSimpleSerializer(serializers.ModelSerializer):
    """Simple serializer for events"""
    organizer_name = serializers.CharField(source='organizer.full_name', read_only=True)
    
    class Meta:
        model = Event
        fields = [
            'id', 'title', 'slug', 'start_date', 'end_date',
            'venue_name', 'city', 'thumbnail_image', 'organizer_name'
        ]


class OrderItemSerializer(serializers.ModelSerializer):
    """Serializer for order items"""
    ticket_type = TicketTypeSimpleSerializer(read_only=True)
    ticket_type_id = serializers.PrimaryKeyRelatedField(
        queryset=TicketType.objects.all(),
        source='ticket_type',
        write_only=True
    )
    
    class Meta:
        model = OrderItem
        fields = [
            'id', 'ticket_type', 'ticket_type_id', 
            'quantity', 'price', 'subtotal'
        ]
        read_only_fields = ['price', 'subtotal']


class TicketSerializer(serializers.ModelSerializer):
    """Serializer for individual tickets - with full event data"""
    event_title = serializers.CharField(source='order_item.order.event.title', read_only=True)
    event_slug = serializers.CharField(source='order_item.order.event.slug', read_only=True)
    event_start_date = serializers.DateTimeField(source='order_item.order.event.start_date', read_only=True)
    event_venue = serializers.CharField(source='order_item.order.event.venue_name', read_only=True)
    event_city = serializers.CharField(source='order_item.order.event.city', read_only=True)
    ticket_type_name = serializers.CharField(source='order_item.ticket_type.name', read_only=True)
    order_number = serializers.CharField(source='order_item.order.order_number', read_only=True)
    order_status = serializers.CharField(source='order_item.order.status', read_only=True)
    
    class Meta:
        model = Ticket
        fields = [
            'id', 'ticket_number', 'event_title', 'event_slug', 'event_start_date',
            'event_venue', 'event_city', 'ticket_type_name', 'order_number', 'order_status',
            'attendee_name', 'attendee_email', 'qr_code', 'status',
            'checked_in', 'checked_in_at', 'created_at'
        ]
        read_only_fields = ['ticket_number', 'qr_code', 'status', 'checked_in', 'checked_in_at']


class OrderSerializer(serializers.ModelSerializer):
    """Serializer for viewing orders"""
    event = EventSimpleSerializer(read_only=True)
    items = OrderItemSerializer(many=True, read_only=True)
    total_tickets = serializers.ReadOnlyField()
    
    class Meta:
        model = Order
        fields = [
            'id', 'order_number', 'event', 'items', 'status',
            'total_amount', 'total_tickets', 'email', 'phone_number',
            'payment_method', 'transaction_id', 'created_at', 'paid_at'
        ]


class OrderCreateSerializer(serializers.ModelSerializer):
    """Serializer for creating orders"""
    items = OrderItemSerializer(many=True)
    event_id = serializers.PrimaryKeyRelatedField(
        queryset=Event.objects.all(),
        source='event',
        write_only=True
    )
    
    class Meta:
        model = Order
        fields = [
            'event_id', 'items', 'email', 'phone_number', 'payment_method'
        ]
    
    def validate_items(self, items):
        if not items:
            raise serializers.ValidationError("Order must contain at least one item")
        
        for item in items:
            ticket_type = item['ticket_type']
            quantity = item['quantity']
            
            if ticket_type.tickets_remaining < quantity:
                raise serializers.ValidationError(
                    f"Only {ticket_type.tickets_remaining} tickets available for {ticket_type.name}"
                )
            
            if quantity < ticket_type.min_purchase:
                raise serializers.ValidationError(
                    f"Minimum purchase for {ticket_type.name} is {ticket_type.min_purchase}"
                )
            if quantity > ticket_type.max_purchase:
                raise serializers.ValidationError(
                    f"Maximum purchase for {ticket_type.name} is {ticket_type.max_purchase}"
                )
        
        return items
    
    def create(self, validated_data):
        items_data = validated_data.pop('items')
        
        total_amount = sum(
            item['ticket_type'].price * item['quantity']
            for item in items_data
        )
        
        order = Order.objects.create(
            total_amount=total_amount,
            **validated_data
        )
        
        for item_data in items_data:
            ticket_type = item_data['ticket_type']
            quantity = item_data['quantity']
            price = ticket_type.price
            
            order_item = OrderItem.objects.create(
                order=order,
                ticket_type=ticket_type,
                quantity=quantity,
                price=price
            )
            
            for i in range(quantity):
                Ticket.objects.create(
                    order_item=order_item,
                    attendee_email=order.email
                )
            
            ticket_type.quantity_sold += quantity
            ticket_type.save()
        
        return order


class PaymentSerializer(serializers.ModelSerializer):
    """Serializer for payment information"""
    order_number = serializers.CharField(source='order.order_number', read_only=True)
    
    class Meta:
        model = Payment
        fields = [
            'id', 'order_number', 'payment_method', 'amount',
            'transaction_id', 'status', 'mpesa_receipt_number',
            'phone_number', 'created_at', 'completed_at'
        ]
        read_only_fields = ['transaction_id', 'status', 'completed_at']