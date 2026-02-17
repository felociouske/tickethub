from rest_framework import generics, filters, status
from rest_framework.permissions import IsAuthenticatedOrReadOnly, IsAuthenticated
from rest_framework.response import Response
from rest_framework.decorators import api_view, permission_classes
from django_filters.rest_framework import DjangoFilterBackend
from django.utils import timezone
from .models import Event, Category, TicketType
from .serializers import (
    EventListSerializer,
    EventDetailSerializer,
    EventCreateUpdateSerializer,
    CategorySerializer,
    TicketTypeSerializer
)
from .permissions import IsOrganizerOrReadOnly


class CategoryListView(generics.ListAPIView):
    """
    API endpoint to list all event categories.
    """
    queryset = Category.objects.all()
    serializer_class = CategorySerializer
    permission_classes = [IsAuthenticatedOrReadOnly]


class EventListView(generics.ListAPIView):
    """
    API endpoint to list all published events.
    Supports filtering by category, city, and date range.
    Supports search by title, description, venue.
    """
    serializer_class = EventListSerializer
    permission_classes = [IsAuthenticatedOrReadOnly]
    filter_backends = [DjangoFilterBackend, filters.SearchFilter, filters.OrderingFilter]
    filterset_fields = ['category', 'city', 'is_featured']
    search_fields = ['title', 'description', 'venue_name']
    ordering_fields = ['start_date', 'created_at', 'views_count']
    ordering = ['start_date']
    
    def get_queryset(self):
        queryset = Event.objects.filter(status='published')
        
        # Filter by date range
        start_date = self.request.query_params.get('start_date', None)
        end_date = self.request.query_params.get('end_date', None)
        
        if start_date:
            queryset = queryset.filter(start_date__gte=start_date)
        if end_date:
            queryset = queryset.filter(end_date__lte=end_date)
        
        # Filter upcoming events only
        upcoming = self.request.query_params.get('upcoming', None)
        if upcoming == 'true':
            queryset = queryset.filter(start_date__gte=timezone.now())
        
        return queryset


class EventDetailView(generics.RetrieveAPIView):
    """
    API endpoint to retrieve a single event by slug.
    Increments view count on each retrieval.
    """
    queryset = Event.objects.filter(status='published')
    serializer_class = EventDetailSerializer
    permission_classes = [IsAuthenticatedOrReadOnly]
    lookup_field = 'slug'
    
    def retrieve(self, request, *args, **kwargs):
        instance = self.get_object()
        
        # Increment view count
        instance.views_count += 1
        instance.save(update_fields=['views_count'])
        
        serializer = self.get_serializer(instance)
        return Response(serializer.data)


class EventCreateView(generics.CreateAPIView):
    """
    API endpoint for organizers to create new events.
    """
    queryset = Event.objects.all()
    serializer_class = EventCreateUpdateSerializer
    permission_classes = [IsAuthenticated]
    
    def perform_create(self, serializer):
        # Check if user is an organizer
        if self.request.user.user_type != 'organizer':
            raise PermissionDenied("Only organizers can create events")
        
        serializer.save(organizer=self.request.user)


class EventUpdateView(generics.UpdateAPIView):
    """
    API endpoint for organizers to update their events.
    """
    queryset = Event.objects.all()
    serializer_class = EventCreateUpdateSerializer
    permission_classes = [IsAuthenticated, IsOrganizerOrReadOnly]
    lookup_field = 'slug'
    
    def get_queryset(self):
        # Organizers can only update their own events
        return Event.objects.filter(organizer=self.request.user)


class EventDeleteView(generics.DestroyAPIView):
    """
    API endpoint for organizers to delete their events.
    """
    queryset = Event.objects.all()
    permission_classes = [IsAuthenticated, IsOrganizerOrReadOnly]
    lookup_field = 'slug'
    
    def get_queryset(self):
        return Event.objects.filter(organizer=self.request.user)


class MyEventsView(generics.ListAPIView):
    """
    API endpoint for organizers to view their own events.
    """
    serializer_class = EventListSerializer
    permission_classes = [IsAuthenticated]
    
    def get_queryset(self):
        return Event.objects.filter(organizer=self.request.user)


class FeaturedEventsView(generics.ListAPIView):
    """
    API endpoint to get featured events.
    """
    queryset = Event.objects.filter(status='published', is_featured=True)[:6]
    serializer_class = EventListSerializer
    permission_classes = [IsAuthenticatedOrReadOnly]


@api_view(['GET'])
@permission_classes([IsAuthenticatedOrReadOnly])
def event_stats(request):
    """
    API endpoint to get general event statistics.
    """
    total_events = Event.objects.filter(status='published').count()
    upcoming_events = Event.objects.filter(
        status='published',
        start_date__gte=timezone.now()
    ).count()
    categories_count = Category.objects.count()
    
    return Response({
        'total_events': total_events,
        'upcoming_events': upcoming_events,
        'categories_count': categories_count
    })


# Import PermissionDenied
from rest_framework.exceptions import PermissionDenied