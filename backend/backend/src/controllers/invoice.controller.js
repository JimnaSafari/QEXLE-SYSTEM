import PDFDocument from 'pdfkit';
import { Invoice, InvoiceItem } from '../models/invoice.model.js';
import { Client } from '../models/client.model.js';
import { Team } from '../models/team.model.js';
import { logger } from '../utils/logger.js';
import { Op } from 'sequelize';

// Generate unique invoice number
const generateInvoiceNumber = async () => {
  const date = new Date();
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const lastInvoice = await Invoice.findOne({
    where: {
      invoiceNumber: {
        [Op.like]: `INV-${year}${month}-%`
      }
    },
    order: [['invoiceNumber', 'DESC']]
  });

  let sequence = 1;
  if (lastInvoice) {
    const lastSequence = parseInt(lastInvoice.invoiceNumber.split('-')[2]);
    sequence = lastSequence + 1;
  }

  return `INV-${year}${month}-${String(sequence).padStart(4, '0')}`;
};

// Create new invoice
export const createInvoice = async (req, res, next) => {
  try {
    const {
      clientId,
      dueDate,
      items,
      notes,
      terms
    } = req.body;

    // Generate invoice number
    const invoiceNumber = await generateInvoiceNumber();

    // Calculate totals
    const subtotal = items.reduce((sum, item) => sum + (item.quantity * item.unitPrice), 0);
    const tax = subtotal * 0.16; // 16% tax rate
    const total = subtotal + tax;

    // Create invoice
    const invoice = await Invoice.create({
      invoiceNumber,
      clientId,
      dueDate,
      subtotal,
      tax,
      total,
      notes,
      terms,
      createdBy: req.user.id
    });

    // Create invoice items
    await Promise.all(items.map(item => 
      InvoiceItem.create({
        ...item,
        invoiceId: invoice.id,
        amount: item.quantity * item.unitPrice
      })
    ));

    // Fetch complete invoice with relationships
    const completeInvoice = await Invoice.findByPk(invoice.id, {
      include: [
        { model: InvoiceItem, as: 'items' },
        { model: Client },
        { model: Team, as: 'creator', attributes: ['firstName', 'lastName', 'email'] }
      ]
    });

    res.status(201).json({
      success: true,
      data: completeInvoice
    });
  } catch (error) {
    next(error);
  }
};

// Get all invoices
export const getInvoices = async (req, res, next) => {
  try {
    const { status, clientId, startDate, endDate } = req.query;
    const where = {};

    if (status) where.status = status;
    if (clientId) where.clientId = clientId;
    if (startDate && endDate) {
      where.issueDate = {
        [Op.between]: [new Date(startDate), new Date(endDate)]
      };
    }

    const invoices = await Invoice.findAll({
      where,
      include: [
        { model: Client },
        { model: Team, as: 'creator', attributes: ['firstName', 'lastName'] }
      ],
      order: [['createdAt', 'DESC']]
    });

    res.json({
      success: true,
      data: invoices
    });
  } catch (error) {
    next(error);
  }
};

// Get single invoice
export const getInvoice = async (req, res, next) => {
  try {
    const invoice = await Invoice.findByPk(req.params.id, {
      include: [
        { model: InvoiceItem, as: 'items' },
        { model: Client },
        { model: Team, as: 'creator', attributes: ['firstName', 'lastName', 'email'] }
      ]
    });

    if (!invoice) {
      return res.status(404).json({
        success: false,
        error: { message: 'Invoice not found' }
      });
    }

    res.json({
      success: true,
      data: invoice
    });
  } catch (error) {
    next(error);
  }
};

// Update invoice
export const updateInvoice = async (req, res, next) => {
  try {
    const invoice = await Invoice.findByPk(req.params.id);
    if (!invoice) {
      return res.status(404).json({
        success: false,
        error: { message: 'Invoice not found' }
      });
    }

    // Only allow updates to draft invoices
    if (invoice.status !== 'draft') {
      return res.status(400).json({
        success: false,
        error: { message: 'Can only update draft invoices' }
      });
    }

    const {
      clientId,
      dueDate,
      items,
      notes,
      terms
    } = req.body;

    // Update invoice
    await invoice.update({
      clientId,
      dueDate,
      notes,
      terms
    });

    // Update items if provided
    if (items) {
      // Delete existing items
      await InvoiceItem.destroy({ where: { invoiceId: invoice.id } });

      // Create new items
      await Promise.all(items.map(item =>
        InvoiceItem.create({
          ...item,
          invoiceId: invoice.id,
          amount: item.quantity * item.unitPrice
        })
      ));

      // Recalculate totals
      const newItems = await InvoiceItem.findAll({ where: { invoiceId: invoice.id } });
      const subtotal = newItems.reduce((sum, item) => sum + item.amount, 0);
      const tax = subtotal * 0.16;
      const total = subtotal + tax;

      await invoice.update({ subtotal, tax, total });
    }

    // Fetch updated invoice
    const updatedInvoice = await Invoice.findByPk(invoice.id, {
      include: [
        { model: InvoiceItem, as: 'items' },
        { model: Client },
        { model: Team, as: 'creator', attributes: ['firstName', 'lastName', 'email'] }
      ]
    });

    res.json({
      success: true,
      data: updatedInvoice
    });
  } catch (error) {
    next(error);
  }
};

// Delete invoice
export const deleteInvoice = async (req, res, next) => {
  try {
    const invoice = await Invoice.findByPk(req.params.id);
    if (!invoice) {
      return res.status(404).json({
        success: false,
        error: { message: 'Invoice not found' }
      });
    }

    // Only allow deletion of draft invoices
    if (invoice.status !== 'draft') {
      return res.status(400).json({
        success: false,
        error: { message: 'Can only delete draft invoices' }
      });
    }

    await invoice.destroy();

    res.json({
      success: true,
      data: {}
    });
  } catch (error) {
    next(error);
  }
};

// Generate PDF invoice
export const generatePDF = async (req, res, next) => {
  try {
    const invoice = await Invoice.findByPk(req.params.id, {
      include: [
        { model: InvoiceItem, as: 'items' },
        { model: Client },
        { model: Team, as: 'creator', attributes: ['firstName', 'lastName', 'email'] }
      ]
    });

    if (!invoice) {
      return res.status(404).json({
        success: false,
        error: { message: 'Invoice not found' }
      });
    }

    // Create PDF document
    const doc = new PDFDocument({ size: 'A4', margin: 50 });

    // Set response headers
    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', `attachment; filename=invoice-${invoice.invoiceNumber}.pdf`);

    // Pipe PDF to response
    doc.pipe(res);

    // Add content to PDF
    doc
      .fontSize(20)
      .text('INVOICE', { align: 'center' })
      .moveDown();

    // Company details
    doc
      .fontSize(12)
      .text('MNA Law Nexus')
      .text('123 Legal Street')
      .text('Nairobi, Kenya')
      .moveDown();

    // Invoice details
    doc
      .text(`Invoice Number: ${invoice.invoiceNumber}`)
      .text(`Date: ${invoice.issueDate.toLocaleDateString()}`)
      .text(`Due Date: ${invoice.dueDate.toLocaleDateString()}`)
      .moveDown();

    // Client details
    doc
      .text('Bill To:')
      .text(invoice.Client.type === 'individual' 
        ? `${invoice.Client.firstName} ${invoice.Client.lastName}`
        : invoice.Client.companyName)
      .text(invoice.Client.address)
      .text(`${invoice.Client.city}, ${invoice.Client.state} ${invoice.Client.zipCode}`)
      .moveDown();

    // Invoice items
    doc
      .text('Items:', { underline: true })
      .moveDown();

    // Table header
    doc
      .text('Description', 50, doc.y)
      .text('Quantity', 300, doc.y)
      .text('Unit Price', 400, doc.y)
      .text('Amount', 500, doc.y)
      .moveDown();

    // Table rows
    invoice.items.forEach(item => {
      doc
        .text(item.description, 50, doc.y)
        .text(item.quantity.toString(), 300, doc.y)
        .text(`$${item.unitPrice.toFixed(2)}`, 400, doc.y)
        .text(`$${item.amount.toFixed(2)}`, 500, doc.y)
        .moveDown();
    });

    // Totals
    doc
      .moveDown()
      .text(`Subtotal: $${invoice.subtotal.toFixed(2)}`, { align: 'right' })
      .text(`Tax (16%): $${invoice.tax.toFixed(2)}`, { align: 'right' })
      .text(`Total: $${invoice.total.toFixed(2)}`, { align: 'right' })
      .moveDown();

    // Notes
    if (invoice.notes) {
      doc
        .text('Notes:', { underline: true })
        .text(invoice.notes)
        .moveDown();
    }

    // Terms
    if (invoice.terms) {
      doc
        .text('Terms:', { underline: true })
        .text(invoice.terms)
        .moveDown();
    }

    // Finalize PDF
    doc.end();
  } catch (error) {
    next(error);
  }
}; 