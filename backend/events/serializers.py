from rest_framework import serializers
from .models import Event, Category, TicketType
from users.serializers import UserSerializer


class CategorySerializer(serializers.ModelSerializer):
    """
    Serializer for event categories.
    """
    events_count = serializers.SerializerMethodField()
    
    class Meta:
        model = Category
        fields = ['id', 'name', 'slug', 'description', 'icon', 'events_count']
    
    def get_events_count(self, obj):
        return obj.events.filter(status='published').count()


class TicketTypeSerializer(serializers.ModelSerializer):
    """
    Serializer for ticket types.
    """
    is_available = serializers.ReadOnlyField()
    tickets_remaining = serializers.ReadOnlyField()
    
    class Meta:
        model = TicketType
        fields = [
            'id', 'name', 'description', 'price', 'quantity',
            'quantity_sold', 'tickets_remaining', 'is_available',
            'sales_start', 'sales_end', 'min_purchase', 'max_purchase'
        ]
        read_only_fields = ['quantity_sold']


class TicketTypeCreateSerializer(serializers.ModelSerializer):
    """
    Serializer for creating ticket types (used by organizers).
    """
    class Meta:
        model = TicketType
        fields = [
            'name', 'description', 'price', 'quantity',
            'sales_start', 'sales_end', 'min_purchase', 'max_purchase'
        ]


class EventListSerializer(serializers.ModelSerializer):
    """
    Lightweight serializer for event listings.
    """
    category = CategorySerializer(read_only=True)
    organizer = UserSerializer(read_only=True)
    min_price = serializers.SerializerMethodField()
    tickets_available = serializers.SerializerMethodField()
    
    class Meta:
        model = Event
        fields = [
            'id', 'title', 'slug', 'category', 'organizer',
            'start_date', 'end_date', 'venue_name', 'city',
            'thumbnail_image', 'is_featured', 'min_price',
            'tickets_available', 'views_count'
        ]
    
    def get_min_price(self, obj):
        ticket_types = obj.ticket_types.filter(quantity_sold__lt=models.F('quantity'))
        if ticket_types.exists():
            return ticket_types.order_by('price').first().price
        return None
    
    def get_tickets_available(self, obj):
        total_remaining = sum(
            ticket.tickets_remaining 
            for ticket in obj.ticket_types.all()
        )
        return total_remaining > 0


class EventDetailSerializer(serializers.ModelSerializer):
    """
    Detailed serializer for single event view.
    """
    category = CategorySerializer(read_only=True)
    organizer = UserSerializer(read_only=True)
    ticket_types = TicketTypeSerializer(many=True, read_only=True)
    is_active = serializers.ReadOnlyField()
    tickets_sold = serializers.ReadOnlyField()
    total_capacity = serializers.ReadOnlyField()
    
    class Meta:
        model = Event
        fields = [
            'id', 'title', 'slug', 'description', 'category',
            'organizer', 'start_date', 'end_date', 'venue_name',
            'venue_address', 'city', 'country', 'banner_image',
            'thumbnail_image', 'status', 'is_featured', 'is_active',
            'ticket_types', 'tickets_sold', 'total_capacity',
            'views_count', 'created_at', 'updated_at'
        ]


class EventCreateUpdateSerializer(serializers.ModelSerializer):
    """
    Serializer for creating and updating events (used by organizers).
    """
    ticket_types = TicketTypeCreateSerializer(many=True, required=False)
    category_id = serializers.PrimaryKeyRelatedField(
        queryset=Category.objects.all(),
        source='category',
        write_only=True
    )
    
    class Meta:
        model = Event
        fields = [
            'title', 'description', 'category_id', 'start_date',
            'end_date', 'venue_name', 'venue_address', 'city',
            'country', 'banner_image', 'thumbnail_image',
            'status', 'ticket_types'
        ]
    
    def create(self, validated_data):
        ticket_types_data = validated_data.pop('ticket_types', [])
        event = Event.objects.create(**validated_data)
        
        # Create ticket types
        for ticket_data in ticket_types_data:
            TicketType.objects.create(event=event, **ticket_data)
        
        return event
    
    def update(self, instance, validated_data):
        ticket_types_data = validated_data.pop('ticket_types', None)
        
        # Update event fields
        for attr, value in validated_data.items():
            setattr(instance, attr, value)
        instance.save()
        
        # Update ticket types if provided
        if ticket_types_data is not None:
            # This is a simple implementation - you may want more sophisticated logic
            instance.ticket_types.all().delete()
            for ticket_data in ticket_types_data:
                TicketType.objects.create(event=instance, **ticket_data)
        
        return instance


# Import models for the min_price calculation
from django.db import models