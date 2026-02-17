from django.contrib import admin
from .models import Category, Event, TicketType


@admin.register(Category)
class CategoryAdmin(admin.ModelAdmin):
    list_display = ('name', 'slug', 'created_at')
    prepopulated_fields = {'slug': ('name',)}
    search_fields = ('name',)


class TicketTypeInline(admin.TabularInline):
    model = TicketType
    extra = 1
    fields = ('name', 'price', 'quantity', 'quantity_sold', 'sales_start', 'sales_end')
    readonly_fields = ('quantity_sold',)


@admin.register(Event)
class EventAdmin(admin.ModelAdmin):
    list_display = (
        'title', 'category', 'organizer', 'start_date', 
        'city', 'status', 'is_featured', 'views_count'
    )
    list_filter = ('status', 'category', 'is_featured', 'city', 'start_date')
    search_fields = ('title', 'description', 'venue_name', 'city')
    prepopulated_fields = {'slug': ('title',)}
    readonly_fields = ('views_count', 'created_at', 'updated_at', 'tickets_sold', 'total_capacity')
    inlines = [TicketTypeInline]
    date_hierarchy = 'start_date'
    
    fieldsets = (
        ('Basic Information', {
            'fields': ('title', 'slug', 'description', 'category', 'organizer')
        }),
        ('Date & Time', {
            'fields': ('start_date', 'end_date')
        }),
        ('Location', {
            'fields': ('venue_name', 'venue_address', 'city', 'country')
        }),
        ('Images', {
            'fields': ('banner_image', 'thumbnail_image')
        }),
        ('Status', {
            'fields': ('status', 'is_featured')
        }),
        ('Statistics', {
            'fields': ('views_count', 'tickets_sold', 'total_capacity', 'created_at', 'updated_at'),
            'classes': ('collapse',)
        }),
    )


@admin.register(TicketType)
class TicketTypeAdmin(admin.ModelAdmin):
    list_display = (
        'event', 'name', 'price', 'quantity', 
        'quantity_sold', 'tickets_remaining', 'is_available'
    )
    list_filter = ('event__category', 'event__status')
    search_fields = ('event__title', 'name')
    readonly_fields = ('quantity_sold', 'tickets_remaining', 'is_available')