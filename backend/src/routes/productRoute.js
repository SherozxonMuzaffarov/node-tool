const express = require('express');
const router = express.Router();
const authMiddleware = require('../middlewares/authMiddleware');
const productController = require('../controllers/productController');
const validations = require('../validators/universalValidator')

router.get('/all', authMiddleware, productController.getAll)
router.get('/one/:id', authMiddleware,  productController.getOne)
router.post('/create', authMiddleware,validations.validate, productController.create)
router.put('/update/:id', authMiddleware, productController.update)
router.put('/update/:id/return', authMiddleware, validations.validate, productController.giveBack)
router.delete('/delete/:id', authMiddleware, productController.delete)

module.exports = router;