import express from 'express'
import { addProduct, deleteProductById, getProductById, getProducts, updateProductById } from '../Controllers/product.js';
import { Authenticated } from "../Middlewares/auth.js";
const router = express.Router();

// add product
router.post('/add', addProduct)

// get product
router.get('/all', getProducts)

// get product by Id
router.get('/:id',getProductById)

// update product by Id
router.put('/:id', Authenticated, updateProductById)

// delete product by Id
router.delete('/:id',deleteProductById)


export default router