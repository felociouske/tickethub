from django.db import models
from django.conf import settings
from django.utils.text import slugify


class Category(models.Model):
    """
    Event categories like Music, Sports, Comedy, etc.
    """
    name = models.CharField(max_length=100, unique=True)
    slug = models.SlugField(max_length=100, unique=True, blank=True)
    description = models.TextField(blank=True)
    icon = models.CharField(max_length=50, blank=True, help_text="Icon class name")
    created_at = models.DateTimeField(auto_now_add=True)
    
    class Meta:
        verbose_name_plural = "Categories"
        ordering = ['name']
    
    def save(self, *args, **kwargs):
        if not self.slug:
            self.slug = slugify(self.name)
        super().save(*args, **kwargs)
    
    def __str__(self):
        return self.name


class Event(models.Model):
    """
    Main Event model representing events that can be ticketed.
    """
    STATUS_CHOICES = (
        ('draft', 'Draft'),
        ('published', 'Published'),
        ('cancelled', 'Cancelled'),
        ('completed', 'Completed'),
    )
    
    # Basic Information
    title = models.CharField(max_length=255)
    slug = models.SlugField(max_length=255, unique=True, blank=True)
    description = models.TextField()
    category = models.ForeignKey(
        Category, 
        on_delete=models.SET_NULL, 
        null=True, 
        related_name='events'
    )
    
    # Organizer
    organizer = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        related_name='organized_events',
        limit_choices_to={'user_type': 'organizer'}
    )
    
    # Date and Time
    start_date = models.DateTimeField()
    end_date = models.DateTimeField()
    
    # Location
    venue_name = models.CharField(max_length=255)
    venue_address = models.TextField()
    city = models.CharField(max_length=100)
    country = models.CharField(max_length=100, default='Kenya')
    
    # Images
    banner_image = models.ImageField(upload_to='events/banners/', blank=True, null=True)
    thumbnail_image = models.ImageField(upload_to='events/thumbnails/', blank=True, null=True)
    
    # Status and Visibility
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='draft')
    is_featured = models.BooleanField(default=False)
    
    # Metadata
    views_count = models.PositiveIntegerField(default=0)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    class Meta:
        ordering = ['-start_date']
        indexes = [
            models.Index(fields=['status', 'start_date']),
            models.Index(fields=['category', 'status']),
        ]
    
    def save(self, *args, **kwargs):
        if not self.slug:
            self.slug = slugify(self.title)
        super().save(*args, **kwargs)
    
    def __str__(self):
        return self.title
    
    @property
    def is_active(self):
        """Check if event is currently published and not ended"""
        from django.utils import timezone
        return self.status == 'published' and self.end_date > timezone.now()
    
    @property
    def tickets_sold(self):
        """Total number of tickets sold for this event"""
        return sum(ticket.tickets_sold for ticket in self.ticket_types.all())
    
    @property
    def total_capacity(self):
        """Total capacity across all ticket types"""
        return sum(ticket.quantity for ticket in self.ticket_types.all())


class TicketType(models.Model):
    """
    Different ticket types for an event (VIP, Regular, Early Bird, etc.)
    """
    event = models.ForeignKey(
        Event, 
        on_delete=models.CASCADE, 
        related_name='ticket_types'
    )
    name = models.CharField(max_length=100)
    description = models.TextField(blank=True)
    price = models.DecimalField(max_digits=10, decimal_places=2)
    quantity = models.PositiveIntegerField(help_text="Total available tickets")
    quantity_sold = models.PositiveIntegerField(default=0)
    
    # Sales period
    sales_start = models.DateTimeField(blank=True, null=True)
    sales_end = models.DateTimeField(blank=True, null=True)
    
    # Constraints
    min_purchase = models.PositiveIntegerField(default=1)
    max_purchase = models.PositiveIntegerField(default=10)
    
    created_at = models.DateTimeField(auto_now_add=True)
    
    class Meta:
        ordering = ['price']
        unique_together = ['event', 'name']
    
    def __str__(self):
        return f"{self.event.title} - {self.name}"
    
    @property
    def is_available(self):
        """Check if tickets are available for purchase"""
        from django.utils import timezone
        now = timezone.now()
        
        # Check quantity
        if self.quantity_sold >= self.quantity:
            return False
        
        # Check sales period
        if self.sales_start and now < self.sales_start:
            return False
        if self.sales_end and now > self.sales_end:
            return False
        
        return True
    
    @property
    def tickets_remaining(self):
        """Number of tickets still available"""
        return self.quantity - self.quantity_sold
    
    @property
    def tickets_sold(self):
        """Alias for quantity_sold"""
        return self.quantity_sold