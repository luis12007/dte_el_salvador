const express = require('express');
const router = express.Router();

const {
  getPaymentStatus,
  getSubscription,
  submitTransfer,
  getMyPayments,
  getProof,
  getTicket,
  adminListClients,
  adminGetUserPayments,
  adminReviewPayment,
  adminConfirmPayment,
  adminSetAmount,
  adminSetSkipCertificate,
} = require('../controllers/paymentController');
const authenticateToken = require('../middleware/verifyToken.js');

// Cliente
router.get('/status/:userId', authenticateToken, getPaymentStatus);
router.get('/subscription/:userId', authenticateToken, getSubscription);
router.post('/transfer/:userId', authenticateToken, submitTransfer);
router.get('/mine/:userId', authenticateToken, getMyPayments);

// Comprobante / ticket (dueño o admin)
router.get('/proof/:paymentId', authenticateToken, getProof);
router.get('/ticket/:paymentId', authenticateToken, getTicket);

// Admin
router.get('/admin/clients', authenticateToken, adminListClients);
router.get('/admin/user/:userId', authenticateToken, adminGetUserPayments);
router.put('/admin/review/:paymentId', authenticateToken, adminReviewPayment);
router.post('/admin/confirm/:userId', authenticateToken, adminConfirmPayment);
router.put('/admin/amount/:userId', authenticateToken, adminSetAmount);
router.put('/admin/skip-certificate/:userId', authenticateToken, adminSetSkipCertificate);

module.exports = router;
