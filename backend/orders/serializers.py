from rest_framework import serializers
from .models import Order, OrderItem, Ticket, Payment
from events.models import Event, TicketType
from events.serializers import EventListSerializer, TicketTypeSerializer


class OrderItemSerializer(serializers.ModelSerializer):
    """
    Serializer for order items.
    """
    ticket_type = TicketTypeSerializer(read_only=True)
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
    """
    Serializer for individual tickets.
    """
    event_title = serializers.CharField(source='event.title', read_only=True)
    ticket_type_name = serializers.CharField(source='ticket_type.name', read_only=True)
    
    class Meta:
        model = Ticket
        fields = [
            'id', 'ticket_number', 'event_title', 'ticket_type_name',
            'attendee_name', 'attendee_email', 'qr_code', 'status',
            'checked_in', 'checked_in_at', 'created_at'
        ]
        read_only_fields = ['ticket_number', 'qr_code', 'status', 'checked_in', 'checked_in_at']


class OrderSerializer(serializers.ModelSerializer):
    """
    Serializer for viewing orders.
    """
    event = EventListSerializer(read_only=True)
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
    """
    Serializer for creating orders.
    """
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
        """Validate that items are not empty and quantities are valid"""
        if not items:
            raise serializers.ValidationError("Order must contain at least one item")
        
        for item in items:
            ticket_type = item['ticket_type']
            quantity = item['quantity']
            
            # Check if enough tickets are available
            if ticket_type.tickets_remaining < quantity:
                raise serializers.ValidationError(
                    f"Only {ticket_type.tickets_remaining} tickets available for {ticket_type.name}"
                )
            
            # Check min/max purchase limits
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
        
        # Calculate total amount
        total_amount = sum(
            item['ticket_type'].price * item['quantity']
            for item in items_data
        )
        
        # Create order
        order = Order.objects.create(
            total_amount=total_amount,
            **validated_data
        )
        
        # Create order items
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
            
            # Create individual tickets
            for i in range(quantity):
                Ticket.objects.create(
                    order_item=order_item,
                    attendee_email=order.email
                )
            
            # Update ticket type quantity sold
            ticket_type.quantity_sold += quantity
            ticket_type.save()
        
        return order


class PaymentSerializer(serializers.ModelSerializer):
    """
    Serializer for payment information.
    """
    order_number = serializers.CharField(source='order.order_number', read_only=True)
    
    class Meta:
        model = Payment
        fields = [
            'id', 'order_number', 'payment_method', 'amount',
            'transaction_id', 'status', 'mpesa_receipt_number',
            'phone_number', 'created_at', 'completed_at'
        ]
        read_only_fields = ['transaction_id', 'status', 'completed_at']


# Import necessary models
from events.models import Event, TicketType