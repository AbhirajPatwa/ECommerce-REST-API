const router = require("express").Router();

const {createProduct,getAllProducts,uploadImage,getSingleProduct,updateProduct,deleteProduct} = require("../controllers/product");
const { authorizeRoles, authMiddleware } = require("../middlewares/auth");



router
  .route('/')
  .get(getAllProducts)
  .post([authMiddleware, authorizeRoles('admin')], createProduct)
  
  router
  .route('/:id')
  .get(getSingleProduct)
  .patch([authMiddleware, authorizeRoles('admin')], updateProduct)
  .delete([authMiddleware, authorizeRoles('admin')], deleteProduct);
  
  router
    .route('/uploadImage')
    .post([authMiddleware, authorizeRoles('admin')],uploadImage);
  

module.exports = router;