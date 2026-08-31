import * as XLSX from 'xlsx';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import { Lead } from '../types';

export type LeadDateFilterPreset =
  | 'ALL'
  | 'TODAY'
  | 'YESTERDAY'
  | 'LAST_7_DAYS'
  | 'THIS_MONTH'
  | 'LAST_30_DAYS'
  | 'CUSTOM';

export interface LeadFilterState {
  datePreset: LeadDateFilterPreset;
  customStartDate: string; // YYYY-MM-DD
  customEndDate: string; // YYYY-MM-DD
  status: string; // 'ALL' | LeadStatus
  searchQuery: string;
}

/**
 * Filter leads based on date preset, custom date range, status, and search query
 */
export function filterLeads(leads: Lead[], filters: LeadFilterState): Lead[] {
  const { datePreset, customStartDate, customEndDate, status, searchQuery } = filters;

  const now = new Date();
  const startOfToday = new Date(now.getFullYear(), now.getMonth(), now.getDate()).getTime();
  const endOfToday = startOfToday + 24 * 60 * 60 * 1000 - 1;

  const startOfYesterday = startOfToday - 24 * 60 * 60 * 1000;
  const endOfYesterday = startOfToday - 1;

  const startOfLast7Days = startOfToday - 6 * 24 * 60 * 1000 * 60;
  const startOfLast30Days = startOfToday - 29 * 24 * 60 * 1000 * 60;
  const startOfThisMonth = new Date(now.getFullYear(), now.getMonth(), 1).getTime();

  return leads.filter((lead) => {
    // 1. Status Filter
    if (status !== 'ALL' && lead.status !== status) {
      return false;
    }

    // 2. Search Query Filter
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase().trim();
      const name = (lead.name || '').toLowerCase();
      const phone = (lead.phone || '').toLowerCase();
      const email = (lead.email || '').toLowerCase();
      const propertyTitle = (lead.propertyTitle || '').toLowerCase();
      const leadType = (lead.leadType || '').toLowerCase();
      const message = (lead.message || '').toLowerCase();

      const matches =
        name.includes(q) ||
        phone.includes(q) ||
        email.includes(q) ||
        propertyTitle.includes(q) ||
        leadType.includes(q) ||
        message.includes(q);

      if (!matches) return false;
    }

    // 3. Date Filter
    if (!lead.createdAt) return datePreset === 'ALL';

    const leadTime = new Date(lead.createdAt).getTime();
    if (isNaN(leadTime)) return true;

    switch (datePreset) {
      case 'TODAY':
        return leadTime >= startOfToday && leadTime <= endOfToday;
      case 'YESTERDAY':
        return leadTime >= startOfYesterday && leadTime <= endOfYesterday;
      case 'LAST_7_DAYS':
        return leadTime >= startOfLast7Days && leadTime <= endOfToday;
      case 'THIS_MONTH':
        return leadTime >= startOfThisMonth && leadTime <= endOfToday;
      case 'LAST_30_DAYS':
        return leadTime >= startOfLast30Days && leadTime <= endOfToday;
      case 'CUSTOM': {
        if (!customStartDate && !customEndDate) return true;
        let valid = true;
        if (customStartDate) {
          const startTimestamp = new Date(`${customStartDate}T00:00:00`).getTime();
          if (!isNaN(startTimestamp) && leadTime < startTimestamp) {
            valid = false;
          }
        }
        if (customEndDate) {
          const endTimestamp = new Date(`${customEndDate}T23:59:59.999`).getTime();
          if (!isNaN(endTimestamp) && leadTime > endTimestamp) {
            valid = false;
          }
        }
        return valid;
      }
      case 'ALL':
      default:
        return true;
    }
  });
}

/**
 * Format a date string into a user-friendly format (DD/MM/YYYY hh:mm A)
 */
export function formatLeadDateTime(dateStr?: string): string {
  if (!dateStr) return 'N/A';
  try {
    const d = new Date(dateStr);
    if (isNaN(d.getTime())) return dateStr;
    return d.toLocaleString('en-IN', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      hour12: true,
    });
  } catch (e) {
    return dateStr;
  }
}

/**
 * Export filtered leads to an Excel (.xlsx) file
 */
export function exportLeadsToExcel(leads: Lead[], filterDescription = 'All Leads') {
  if (!leads || leads.length === 0) {
    throw new Error('No leads available to export with the current filter.');
  }

  // Transform leads into structured Excel rows
  const rows = leads.map((lead, index) => ({
    'S.No': index + 1,
    'Received Date & Time': formatLeadDateTime(lead.createdAt),
    'Client Name': lead.name || 'N/A',
    'Phone Number': lead.phone || 'N/A',
    'Email Address': lead.email || 'N/A',
    'Inquiry Type': lead.leadType || 'GENERAL',
    'Property / Context': lead.propertyTitle || 'General Website Inquiry',
    'Lead Status': lead.status || 'NEW',
    'Client Message / Requirements': lead.message || '-',
    'Lead ID': lead.id,
  }));

  // Create worksheet
  const worksheet = XLSX.utils.json_to_sheet(rows);

  // Set explicit column widths for beautiful layout
  worksheet['!cols'] = [
    { wch: 6 },  // S.No
    { wch: 22 }, // Date & Time
    { wch: 22 }, // Name
    { wch: 16 }, // Phone
    { wch: 26 }, // Email
    { wch: 16 }, // Type
    { wch: 32 }, // Property / Context
    { wch: 14 }, // Status
    { wch: 45 }, // Message
    { wch: 16 }, // ID
  ];

  // Create workbook and append worksheet
  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, 'Client Leads');

  // Generate file name with current timestamp
  const now = new Date();
  const dateFormatted = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')}`;
  const fileName = `TheMarsTV_Leads_Report_${dateFormatted}.xlsx`;

  // Trigger file download
  XLSX.writeFile(workbook, fileName);
}

/**
 * Export filtered leads to a beautifully styled PDF report
 */
export function exportLeadsToPDF(
  leads: Lead[],
  filterInfo?: {
    dateLabel?: string;
    statusLabel?: string;
    searchQuery?: string;
  }
) {
  if (!leads || leads.length === 0) {
    throw new Error('No leads available to export with the current filter.');
  }

  // Create PDF in Landscape A4 mode for optimal data grid layout
  const doc = new jsPDF({
    orientation: 'landscape',
    unit: 'mm',
    format: 'a4',
  });

  const pageWidth = doc.internal.pageSize.getWidth();
  const pageHeight = doc.internal.pageSize.getHeight();

  // 1. Top Header Banner (Red #D61F26 brand header)
  doc.setFillColor(214, 31, 38); // #D61F26
  doc.rect(0, 0, pageWidth, 22, 'F');

  // Title Text inside banner
  doc.setTextColor(255, 255, 255);
  doc.setFontSize(14);
  doc.setFont('helvetica', 'bold');
  doc.text('THE MARS TV - REAL ESTATE PORTAL', 14, 11);

  doc.setFontSize(9);
  doc.setFont('helvetica', 'normal');
  doc.text('ADMIN CLIENT INQUIRIES & LEADS REPORT', 14, 17);

  // Generation timestamp on right of banner
  const now = new Date();
  const genDateStr = now.toLocaleString('en-IN', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    hour12: true,
  });
  doc.setFontSize(8.5);
  doc.text(`Generated: ${genDateStr}`, pageWidth - 14, 14, { align: 'right' });

  // 2. Filter Summary Sub-header Box
  doc.setFillColor(248, 250, 252); // #f8fafc
  doc.setDrawColor(226, 232, 240); // #e2e8f0
  doc.roundedRect(14, 26, pageWidth - 28, 12, 2, 2, 'FD');

  doc.setTextColor(30, 41, 59); // slate-800
  doc.setFontSize(9);
  doc.setFont('helvetica', 'bold');
  doc.text(`Total Records: ${leads.length} Leads`, 18, 33.5);

  doc.setFont('helvetica', 'normal');
  doc.setTextColor(100, 116, 139); // slate-500
  const dateLabel = filterInfo?.dateLabel || 'All Time';
  const statusLabel = filterInfo?.statusLabel || 'ALL';
  const searchNote = filterInfo?.searchQuery ? ` | Search: "${filterInfo.searchQuery}"` : '';
  doc.text(`Filter Applied: Date (${dateLabel}) | Status (${statusLabel})${searchNote}`, 70, 33.5);

  // 3. Prepare Table Data for autoTable
  const tableHeaders = [
    ['#', 'Date & Time', 'Client Name', 'Contact Phone', 'Email', 'Type', 'Status', 'Property / Message'],
  ];

  const tableRows = leads.map((lead, idx) => {
    const formattedDate = formatLeadDateTime(lead.createdAt);
    const propOrMsg = [
      lead.propertyTitle ? `[Property] ${lead.propertyTitle}` : '',
      lead.message ? `[Msg] ${lead.message}` : '',
    ]
      .filter(Boolean)
      .join('\n') || '-';

    return [
      String(idx + 1),
      formattedDate,
      lead.name || 'N/A',
      lead.phone || 'N/A',
      lead.email || '-',
      lead.leadType || 'GENERAL',
      lead.status || 'NEW',
      propOrMsg,
    ];
  });

  // 4. Render Table
  autoTable(doc, {
    head: tableHeaders,
    body: tableRows,
    startY: 42,
    margin: { left: 14, right: 14, bottom: 16 },
    theme: 'grid',
    styles: {
      fontSize: 8,
      cellPadding: 2.5,
      valign: 'middle',
      overflow: 'linebreak',
      textColor: [30, 41, 59],
      lineColor: [226, 232, 240],
      lineWidth: 0.2,
    },
    headStyles: {
      fillColor: [214, 31, 38], // Red #D61F26
      textColor: [255, 255, 255],
      fontStyle: 'bold',
      fontSize: 8.5,
      halign: 'left',
    },
    alternateRowStyles: {
      fillColor: [248, 250, 252],
    },
    columnStyles: {
      0: { cellWidth: 10, halign: 'center' }, // #
      1: { cellWidth: 32 },                   // Date
      2: { cellWidth: 30, fontStyle: 'bold' },// Name
      3: { cellWidth: 26 },                   // Phone
      4: { cellWidth: 35 },                   // Email
      5: { cellWidth: 22 },                   // Type
      6: { cellWidth: 22, fontStyle: 'bold' },// Status
      7: { cellWidth: 'auto' },               // Property / Message
    },
    didDrawPage: (data) => {
      // Footer on every page
      const pageCount = (doc.internal as any).getNumberOfPages ? (doc.internal as any).getNumberOfPages() : 1;
      const currentPage = data.pageNumber;

      doc.setFontSize(8);
      doc.setFont('helvetica', 'normal');
      doc.setTextColor(148, 163, 184); // slate-400

      doc.text('The Mars TV Real Estate Portal - Confidential Admin Report', 14, pageHeight - 8);
      doc.text(`Page ${currentPage} of ${pageCount}`, pageWidth - 14, pageHeight - 8, { align: 'right' });
    },
  });

  // 5. Trigger download
  const dateFormatted = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')}`;
  const fileName = `TheMarsTV_Leads_Report_${dateFormatted}.pdf`;
  doc.save(fileName);
}
