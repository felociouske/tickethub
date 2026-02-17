from django.urls import path
from .views import (
    CategoryListView,
    EventListView,
    EventDetailView,
    EventCreateView,
    EventUpdateView,
    EventDeleteView,
    MyEventsView,
    FeaturedEventsView,
    event_stats
)

urlpatterns = [
    # Categories
    path('categories/', CategoryListView.as_view(), name='category-list'),
    
    # Events - Public
    path('', EventListView.as_view(), name='event-list'),
    path('featured/', FeaturedEventsView.as_view(), name='featured-events'),
    path('stats/', event_stats, name='event-stats'),
    path('<slug:slug>/', EventDetailView.as_view(), name='event-detail'),
    
    # Events - Organizer Only
    path('create/', EventCreateView.as_view(), name='event-create'),
    path('<slug:slug>/update/', EventUpdateView.as_view(), name='event-update'),
    path('<slug:slug>/delete/', EventDeleteView.as_view(), name='event-delete'),
    path('my/events/', MyEventsView.as_view(), name='my-events'),
]