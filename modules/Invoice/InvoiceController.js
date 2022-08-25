const fs = require('fs');
const getGrant = require('../../utilities/getGrant');
const invoiceConfig = require('../../config/invoice');
const InvoiceGenerator = require('./InvoiceGenerator');
const { reportError } = require('../../services/errorReportingService');
const logger = require('../../utilities/logger');

/**
 * InvoiceController.js
 *
 * @description :: Server-side logic for managing Invoices.
 */
module.exports = {
  async download(req, res) {
    try {
      const { invoiceId } = req.params;
      logger.info('Downloading invoice', { invoiceId });

      const grantApplication = await getGrant(req, res);
      const payment = grantApplication.payments[invoiceId];

      if (!payment) {
        throw new Error('Payment not found');
      }

      // eslint-disable-next-line no-underscore-dangle
      const t = req.__;
      const filename = `${grantApplication.nearId}-${grantApplication.id}-${invoiceId}-${Date.now()}-${Math.floor(Math.random() * 100000)}.pdf`;
      const invoicePath = await InvoiceGenerator.createInvoice({ filename, payment, grantApplication, invoiceId, invoiceConfig, t });

      // Required hack to make the file download
      // eslint-disable-next-line no-promise-executor-return
      await new Promise((resolve) => setTimeout(resolve, 100));

      res.contentType('application/pdf');
      res.download(invoicePath, filename, () => {
        fs.unlinkSync(invoicePath);
      });
    } catch (error) {
      reportError(error, 'Could not get download invoice');
      res.status(500).json({
        message: error.message,
      });
    }
  },
};
