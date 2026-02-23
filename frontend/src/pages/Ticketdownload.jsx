import { jsPDF } from 'jspdf';
import { format } from 'date-fns';

/**
 * Generate and download a ticket as PDF
 * @param {Object} ticket - Ticket data from API
 */
export const downloadTicket = async (ticket) => {
  try {
    // Create new PDF document
    const pdf = new jsPDF({
      orientation: 'portrait',
      unit: 'mm',
      format: 'a4'
    });

    const pageWidth = pdf.internal.pageSize.getWidth();
    const pageHeight = pdf.internal.pageSize.getHeight();

    // Colors
    const primaryColor = [220, 38, 38]; // Red
    const secondaryColor = [55, 65, 81]; // Gray
    const lightGray = [243, 244, 246];

    // Background
    pdf.setFillColor(...lightGray);
    pdf.rect(0, 0, pageWidth, pageHeight, 'F');

    // Header with gradient effect (simulated with rectangles)
    pdf.setFillColor(...primaryColor);
    pdf.rect(0, 0, pageWidth, 50, 'F');
    
    // TicketHub logo/title
    pdf.setTextColor(255, 255, 255);
    pdf.setFontSize(32);
    pdf.setFont('helvetica', 'bold');
    pdf.text('TicketHub', pageWidth / 2, 25, { align: 'center' });
    
    pdf.setFontSize(12);
    pdf.setFont('helvetica', 'normal');
    pdf.text('Your Event Ticket', pageWidth / 2, 35, { align: 'center' });

    // Main ticket container
    const margin = 15;
    const ticketY = 60;
    const ticketHeight = pageHeight - ticketY - 20;
    
    // White ticket background
    pdf.setFillColor(255, 255, 255);
    pdf.roundedRect(margin, ticketY, pageWidth - (margin * 2), ticketHeight, 5, 5, 'F');

    // Event title
    pdf.setTextColor(...secondaryColor);
    pdf.setFontSize(24);
    pdf.setFont('helvetica', 'bold');
    const eventTitle = ticket.event_title || 'Event';
    pdf.text(eventTitle, pageWidth / 2, ticketY + 20, { 
      align: 'center',
      maxWidth: pageWidth - 40
    });

    // Ticket type
    pdf.setFontSize(14);
    pdf.setFont('helvetica', 'normal');
    pdf.setTextColor(100, 100, 100);
    pdf.text(ticket.ticket_type_name || 'General Admission', pageWidth / 2, ticketY + 30, { 
      align: 'center' 
    });

    // Divider line
    pdf.setDrawColor(...primaryColor);
    pdf.setLineWidth(0.5);
    pdf.line(margin + 10, ticketY + 40, pageWidth - margin - 10, ticketY + 40);

    // Event details section
    let currentY = ticketY + 55;
    pdf.setFontSize(10);
    pdf.setTextColor(...secondaryColor);

    // Venue
    if (ticket.event_venue) {
      pdf.setFont('helvetica', 'bold');
      pdf.text('VENUE', margin + 10, currentY);
      pdf.setFont('helvetica', 'normal');
      pdf.text(ticket.event_venue, margin + 10, currentY + 6);
      pdf.text(ticket.event_city || '', margin + 10, currentY + 11);
      currentY += 25;
    }

    // Date
    if (ticket.event_start_date) {
      pdf.setFont('helvetica', 'bold');
      pdf.text('DATE & TIME', margin + 10, currentY);
      pdf.setFont('helvetica', 'normal');
      const eventDate = new Date(ticket.event_start_date);
      pdf.text(format(eventDate, 'EEEE, MMMM dd, yyyy'), margin + 10, currentY + 6);
      pdf.text(format(eventDate, 'h:mm a'), margin + 10, currentY + 11);
      currentY += 25;
    }

    // Attendee info
    if (ticket.attendee_name) {
      pdf.setFont('helvetica', 'bold');
      pdf.text('ATTENDEE', margin + 10, currentY);
      pdf.setFont('helvetica', 'normal');
      pdf.text(ticket.attendee_name, margin + 10, currentY + 6);
      if (ticket.attendee_email) {
        pdf.text(ticket.attendee_email, margin + 10, currentY + 11);
      }
      currentY += 25;
    }

    // QR Code section
    if (ticket.qr_code) {
      try {
        // QR code background
        pdf.setFillColor(245, 245, 245);
        const qrBoxSize = 80;
        const qrBoxX = (pageWidth - qrBoxSize) / 2;
        const qrBoxY = currentY;
        pdf.roundedRect(qrBoxX, qrBoxY, qrBoxSize, qrBoxSize + 15, 3, 3, 'F');

        // Add QR code image
        const qrSize = 60;
        const qrX = (pageWidth - qrSize) / 2;
        const qrY = qrBoxY + 5;
        
        // Convert QR code URL to base64 if it's a full URL
        let qrCodeData = ticket.qr_code;
        if (qrCodeData.startsWith('http')) {
          // For remote images, we'll need to fetch them
          const response = await fetch(qrCodeData);
          const blob = await response.blob();
          qrCodeData = await new Promise((resolve) => {
            const reader = new FileReader();
            reader.onloadend = () => resolve(reader.result);
            reader.readAsDataURL(blob);
          });
        }
        
        pdf.addImage(qrCodeData, 'PNG', qrX, qrY, qrSize, qrSize);
        
        // QR code label
        pdf.setFontSize(8);
        pdf.setFont('helvetica', 'bold');
        pdf.text('SCAN AT ENTRANCE', pageWidth / 2, qrBoxY + qrSize + 12, { 
          align: 'center' 
        });
        
        currentY = qrBoxY + qrBoxSize + 20;
      } catch (error) {
        console.error('Error adding QR code:', error);
        currentY += 10;
      }
    }

    // Ticket number section
    pdf.setFillColor(...primaryColor);
    pdf.rect(margin, currentY, pageWidth - (margin * 2), 20, 'F');
    
    pdf.setTextColor(255, 255, 255);
    pdf.setFontSize(8);
    pdf.setFont('helvetica', 'bold');
    pdf.text('TICKET NUMBER', pageWidth / 2, currentY + 7, { align: 'center' });
    
    pdf.setFontSize(12);
    pdf.setFont('helvetica', 'bold');
    pdf.text(ticket.ticket_number, pageWidth / 2, currentY + 15, { align: 'center' });

    // Order number
    currentY += 25;
    pdf.setFontSize(8);
    pdf.setTextColor(...secondaryColor);
    pdf.setFont('helvetica', 'normal');
    pdf.text(`Order #${ticket.order_number}`, pageWidth / 2, currentY, { align: 'center' });

    // Footer
    const footerY = pageHeight - 15;
    pdf.setFontSize(7);
    pdf.setTextColor(120, 120, 120);
    pdf.text('Present this ticket at the venue entrance', pageWidth / 2, footerY, { 
      align: 'center' 
    });
    pdf.text('Keep this ticket safe - it is your proof of purchase', pageWidth / 2, footerY + 4, { 
      align: 'center' 
    });

    // Save PDF
    const filename = `ticket-${ticket.ticket_number}.pdf`;
    pdf.save(filename);

    return true;
  } catch (error) {
    console.error('Error generating ticket PDF:', error);
    throw error;
  }
};

/**
 * Download all tickets for an order
 * @param {Array} tickets - Array of ticket objects
 */
export const downloadAllTickets = async (tickets) => {
  for (const ticket of tickets) {
    await downloadTicket(ticket);
    // Small delay between downloads
    await new Promise(resolve => setTimeout(resolve, 500));
  }
};