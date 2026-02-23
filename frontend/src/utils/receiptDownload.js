import { jsPDF } from 'jspdf';
import { format } from 'date-fns';

/**
 * Generate and download an order receipt as PDF
 * @param {Object} order - Order data from API
 */
export const downloadReceipt = (order) => {
  try {
    // Create new PDF document
    const pdf = new jsPDF({
      orientation: 'portrait',
      unit: 'mm',
      format: 'a4'
    });

    const pageWidth = pdf.internal.pageSize.getWidth();
    const margin = 20;

    // Colors
    const primaryColor = [220, 38, 38]; // Red
    const darkGray = [55, 65, 81];
    const lightGray = [156, 163, 175];

    // Header
    pdf.setFillColor(...primaryColor);
    pdf.rect(0, 0, pageWidth, 40, 'F');

    // Logo/Title
    pdf.setTextColor(255, 255, 255);
    pdf.setFontSize(28);
    pdf.setFont('helvetica', 'bold');
    pdf.text('TicketHub', margin, 20);

    pdf.setFontSize(12);
    pdf.setFont('helvetica', 'normal');
    pdf.text('Payment Receipt', margin, 30);

    // Receipt title
    let currentY = 55;
    pdf.setTextColor(...darkGray);
    pdf.setFontSize(20);
    pdf.setFont('helvetica', 'bold');
    pdf.text('Order Receipt', margin, currentY);

    // Status badge
    const statusColor = order.status === 'paid' ? [34, 197, 94] : [234, 179, 8];
    pdf.setFillColor(...statusColor);
    pdf.roundedRect(pageWidth - margin - 35, currentY - 6, 35, 8, 2, 2, 'F');
    pdf.setTextColor(255, 255, 255);
    pdf.setFontSize(10);
    pdf.setFont('helvetica', 'bold');
    pdf.text(order.status.toUpperCase(), pageWidth - margin - 32, currentY - 1);

    // Divider
    currentY += 10;
    pdf.setDrawColor(...lightGray);
    pdf.setLineWidth(0.5);
    pdf.line(margin, currentY, pageWidth - margin, currentY);

    // Order details section
    currentY += 12;
    pdf.setTextColor(...darkGray);
    pdf.setFontSize(10);
    pdf.setFont('helvetica', 'normal');

    // Two-column layout for order info
    const col1X = margin;
    const col2X = pageWidth / 2 + 10;

    // Left column
    pdf.setFont('helvetica', 'bold');
    pdf.text('Order Number:', col1X, currentY);
    pdf.setFont('helvetica', 'normal');
    pdf.text(order.order_number, col1X, currentY + 5);

    pdf.setFont('helvetica', 'bold');
    pdf.text('Order Date:', col1X, currentY + 15);
    pdf.setFont('helvetica', 'normal');
    pdf.text(format(new Date(order.created_at), 'MMM dd, yyyy'), col1X, currentY + 20);

    // Right column
    if (order.transaction_id) {
      pdf.setFont('helvetica', 'bold');
      pdf.text('Transaction ID:', col2X, currentY);
      pdf.setFont('helvetica', 'normal');
      pdf.text(order.transaction_id, col2X, currentY + 5);
    }

    if (order.paid_at) {
      pdf.setFont('helvetica', 'bold');
      pdf.text('Payment Date:', col2X, currentY + 15);
      pdf.setFont('helvetica', 'normal');
      pdf.text(format(new Date(order.paid_at), 'MMM dd, yyyy'), col2X, currentY + 20);
    }

    currentY += 35;

    // Event details section
    pdf.setFillColor(249, 250, 251);
    pdf.rect(margin, currentY, pageWidth - 2 * margin, 35, 'F');

    currentY += 8;
    pdf.setFont('helvetica', 'bold');
    pdf.setFontSize(12);
    pdf.setTextColor(...darkGray);
    pdf.text('Event Details', margin + 5, currentY);

    currentY += 8;
    pdf.setFontSize(14);
    pdf.text(order.event?.title || 'Event', margin + 5, currentY);

    currentY += 7;
    pdf.setFontSize(10);
    pdf.setFont('helvetica', 'normal');
    pdf.setTextColor(...lightGray);
    
    if (order.event?.start_date) {
      const eventDate = format(new Date(order.event.start_date), 'EEEE, MMMM dd, yyyy');
      pdf.text(eventDate, margin + 5, currentY);
    }
    
    currentY += 5;
    if (order.event?.venue_name) {
      pdf.text(`${order.event.venue_name}, ${order.event.city || ''}`, margin + 5, currentY);
    }

    // Tickets table
    currentY += 20;
    pdf.setTextColor(...darkGray);
    pdf.setFont('helvetica', 'bold');
    pdf.setFontSize(12);
    pdf.text('Tickets Ordered', margin, currentY);

    currentY += 8;

    // Table header
    pdf.setFillColor(243, 244, 246);
    pdf.rect(margin, currentY, pageWidth - 2 * margin, 10, 'F');
    
    pdf.setFontSize(9);
    pdf.setFont('helvetica', 'bold');
    pdf.setTextColor(...darkGray);
    pdf.text('Ticket Type', margin + 5, currentY + 6);
    pdf.text('Qty', pageWidth - margin - 60, currentY + 6);
    pdf.text('Price', pageWidth - margin - 40, currentY + 6);
    pdf.text('Subtotal', pageWidth - margin - 5, currentY + 6, { align: 'right' });

    currentY += 12;

    // Table rows
    pdf.setFont('helvetica', 'normal');
    if (order.items && order.items.length > 0) {
      order.items.forEach((item, index) => {
        if (index > 0) currentY += 8;
        
        pdf.text(item.ticket_type?.name || 'Ticket', margin + 5, currentY);
        pdf.text(String(item.quantity), pageWidth - margin - 60, currentY);
        pdf.text(`KSh ${parseFloat(item.price).toLocaleString()}`, pageWidth - margin - 40, currentY);
        pdf.text(`KSh ${parseFloat(item.subtotal).toLocaleString()}`, pageWidth - margin - 5, currentY, { align: 'right' });
      });
    }

    currentY += 12;

    // Total section
    pdf.setDrawColor(...lightGray);
    pdf.line(margin, currentY, pageWidth - margin, currentY);

    currentY += 8;
    pdf.setFont('helvetica', 'bold');
    pdf.setFontSize(10);
    pdf.setTextColor(...darkGray);
    pdf.text('Subtotal:', pageWidth - margin - 50, currentY);
    pdf.text(`KSh ${parseFloat(order.total_amount).toLocaleString()}`, pageWidth - margin - 5, currentY, { align: 'right' });

    currentY += 8;
    pdf.setFontSize(12);
    pdf.text('Total Paid:', pageWidth - margin - 50, currentY);
    pdf.setTextColor(...primaryColor);
    pdf.setFontSize(14);
    pdf.text(`KSh ${parseFloat(order.total_amount).toLocaleString()}`, pageWidth - margin - 5, currentY, { align: 'right' });

    // Contact information
    currentY += 20;
    pdf.setTextColor(...darkGray);
    pdf.setFont('helvetica', 'bold');
    pdf.setFontSize(12);
    pdf.text('Contact Information', margin, currentY);

    currentY += 8;
    pdf.setFont('helvetica', 'normal');
    pdf.setFontSize(10);
    pdf.text('Email:', margin, currentY);
    pdf.text(order.email, margin + 25, currentY);

    currentY += 6;
    pdf.text('Phone:', margin, currentY);
    pdf.text(order.phone_number, margin + 25, currentY);

    // Payment method
    currentY += 6;
    pdf.text('Payment Method:', margin, currentY);
    pdf.text(order.payment_method.toUpperCase(), margin + 35, currentY);

    // Footer
    const footerY = pdf.internal.pageSize.getHeight() - 20;
    pdf.setFontSize(8);
    pdf.setTextColor(...lightGray);
    pdf.setFont('helvetica', 'normal');
    pdf.text('Thank you for your purchase!', pageWidth / 2, footerY, { align: 'center' });
    pdf.text('For support, contact support@tickethub.com', pageWidth / 2, footerY + 4, { align: 'center' });
    
    // QR code or reference
    pdf.text(`Reference: ${order.order_number}`, pageWidth / 2, footerY + 8, { align: 'center' });

    // Save PDF
    const filename = `receipt-${order.order_number}.pdf`;
    pdf.save(filename);

    return true;
  } catch (error) {
    console.error('Error generating receipt PDF:', error);
    throw error;
  }
};