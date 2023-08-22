import express from 'express';
const router = express.Router();
import userControllers from '../controller/homedata.js'
router.use(express.json())
import cors from 'cors'
const corsOpts = {
    origin: '*',
  
    methods: [
      'GET',
      'POST',
    ],
  
    allowedHeaders: [
      'Content-Type',
    ],
  };
  
router.use(cors(corsOpts));
// public Routes 

router.post('/CreateNewProduct', userControllers.CreateNewProduct);
router.post('/email', userControllers.email);
router.get('/allproduct', userControllers.allProduct);
router.post('/updateUserDetails', userControllers.updateUserDetails)


export default router