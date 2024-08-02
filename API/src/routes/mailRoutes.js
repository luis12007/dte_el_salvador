const express = require('express');
const router = express.Router();

const {
    sendMailFactura,
    sendMailCCF,
} = require('../controllers/mailController.js');

const { sendPDF } = require('../controllers/sendPDF.js')
const authenticateToken = require('../middleware/verifyToken.js');



router.post('/factura/:id_emisor', authenticateToken, sendMailFactura);
router.post('/CCF/:id_emisor', authenticateToken, sendMailCCF);
router.post('/bill/:id_emisor', authenticateToken, sendPDF);



module.exports = router;