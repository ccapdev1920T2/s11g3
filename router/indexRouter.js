const express = require('express');
const router = express();
const controller = require('../controller/index');
const middleware = require('../middlewares/indexMiddleware');

router.get('/', controller.getHome);
router.get('/login', controller.getLogin);
router.get('/stats', controller.getStats);
router.get('/account', controller.getAccount);
router.get('/registration', controller.getRegister);
router.get('/changepass', controller.getChangePW);
router.get('/products', controller.getProducts);
router.get('/search', controller.getSearchPName);
router.get('/category/*', controller.getSearchCat);
router.get('/products/*', controller.getProdPage);

router.post('/stats', controller.postStats);
router.post('/login', middleware.validateLogin, controller.postLogin);
router.post('/logout', controller.postLogout);
router.post('/registration', middleware.validateReg, controller.postReg);
router.post('/changepass', middleware.validateChangePW, controller.postChangePW);
router.post('/addtocart/:id', controller.postAddCart);
router.post('/wishlist/:id', controller.postAddWish);

module.exports = router;
