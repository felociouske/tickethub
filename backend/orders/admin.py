from django.contrib import admin
from django.utils import timezone
from .models import Order, OrderItem, Ticket, Payment, PaymentProof


class OrderItemInline(admin.TabularInline):
    model = OrderItem
    extra = 0
    readonly_fields = ('ticket_type', 'quantity', 'price', 'subtotal')
    can_delete = False


class TicketInline(admin.TabularInline):
    model = Ticket
    extra = 0
    readonly_fields = ('ticket_number', 'qr_code', 'status', 'checked_in', 'checked_in_at')
    fields = ('ticket_number', 'attendee_name', 'attendee_email', 'status', 'checked_in')
    can_delete = False


@admin.register(Order)
class OrderAdmin(admin.ModelAdmin):
    list_display = (
        'order_number', 'user', 'event', 'status',
        'total_amount', 'total_tickets', 'created_at', 'paid_at'
    )
    list_filter = ('status', 'payment_method', 'created_at')
    search_fields = ('order_number', 'user__email', 'event__title', 'transaction_id')
    readonly_fields = ('order_number', 'total_tickets', 'created_at', 'updated_at', 'paid_at')
    inlines = [OrderItemInline]
    date_hierarchy = 'created_at'
    
    fieldsets = (
        ('Order Information', {
            'fields': ('order_number', 'user', 'event', 'status')
        }),
        ('Pricing', {
            'fields': ('total_amount', 'total_tickets')
        }),
        ('Contact Details', {
            'fields': ('email', 'phone_number')
        }),
        ('Payment', {
            'fields': ('payment_method', 'transaction_id', 'paid_at')
        }),
        ('Timestamps', {
            'fields': ('created_at', 'updated_at'),
            'classes': ('collapse',)
        }),
    )


@admin.register(OrderItem)
class OrderItemAdmin(admin.ModelAdmin):
    list_display = ('order', 'ticket_type', 'quantity', 'price', 'subtotal')
    list_filter = ('ticket_type__event',)
    search_fields = ('order__order_number', 'ticket_type__name')
    readonly_fields = ('subtotal', 'created_at')


@admin.register(Ticket)
class TicketAdmin(admin.ModelAdmin):
    list_display = (
        'ticket_number', 'event', 'ticket_type', 'attendee_name',
        'status', 'checked_in', 'created_at'
    )
    list_filter = ('status', 'checked_in', 'order_item__ticket_type__event')
    search_fields = ('ticket_number', 'attendee_name', 'attendee_email')
    readonly_fields = ('ticket_number', 'qr_code', 'checked_in_at', 'created_at')
    inlines = []
    
    fieldsets = (
        ('Ticket Information', {
            'fields': ('ticket_number', 'order_item', 'qr_code')
        }),
        ('Attendee Details', {
            'fields': ('attendee_name', 'attendee_email')
        }),
        ('Status', {
            'fields': ('status', 'checked_in', 'checked_in_at')
        }),
        ('Timestamp', {
            'fields': ('created_at',)
        }),
    )


@admin.register(Payment)
class PaymentAdmin(admin.ModelAdmin):
    list_display = (
        'order', 'payment_method', 'amount', 'status',
        'transaction_id', 'created_at', 'completed_at'
    )
    list_filter = ('payment_method', 'status', 'created_at')
    search_fields = ('order__order_number', 'transaction_id', 'mpesa_receipt_number')
    readonly_fields = ('created_at', 'updated_at', 'completed_at', 'raw_response')
    
    fieldsets = (
        ('Order & Payment', {
            'fields': ('order', 'payment_method', 'amount', 'status')
        }),
        ('Transaction Details', {
            'fields': ('transaction_id', 'mpesa_receipt_number', 'phone_number')
        }),
        ('Metadata', {
            'fields': ('raw_response',),
            'classes': ('collapse',)
        }),
        ('Timestamps', {
            'fields': ('created_at', 'updated_at', 'completed_at'),
            'classes': ('collapse',)
        }),
    )

@admin.register(PaymentProof)
class PaymentProofAdmin(admin.ModelAdmin):
    list_display = ['transaction_code', 'order', 'amount', 'status', 'created_at']
    list_filter = ['status', 'created_at']
    search_fields = ['transaction_code', 'order__order_number', 'phone_number']
    readonly_fields = ['created_at', 'updated_at']
    actions = ['approve_payments', 'reject_payments']
    
    fieldsets = (
        ('Payment Proof', {
            'fields': ('order', 'transaction_code', 'phone_number', 'payment_method', 'amount', 'status')
        }),
        ('Verification', {
            'fields': ('verified_by', 'verified_at', 'rejection_reason', 'notes')
        }),
        ('Timestamps', {
            'fields': ('created_at', 'updated_at'),
            'classes': ('collapse',)
        }),
    )
    
    def approve_payments(self, request, queryset):
        for proof in queryset.filter(status='pending'):
            proof.status = 'approved'
            proof.verified_by = request.user
            proof.verified_at = timezone.now()
            proof.save()
            
            # Update order
            proof.order.status = 'paid'
            proof.order.transaction_id = proof.transaction_code
            proof.order.paid_at = timezone.now()
            proof.order.save()
        
        self.message_user(request, f"{queryset.count()} payments approved")
    approve_payments.short_description = "✅ Approve selected payments"
    
    def reject_payments(self, request, queryset):
        queryset.update(status='rejected', verified_by=request.user, verified_at=timezone.now())
        self.message_user(request, f"{queryset.count()} payments rejected")
    reject_payments.short_description = "❌ Reject selected payments"