const express = require('express');
const router = express.Router();

const {
    sendMailFactura,
    sendMailCCF,
} = require('../controllers/mailController.js');
const authenticateToken = require('../middleware/verifyToken.js');



router.post('/factura/:id_emisor', authenticateToken,sendMailFactura);
router.post('/CCF:id_emisor', authenticateToken,sendMailCCF);



module.exports = router;