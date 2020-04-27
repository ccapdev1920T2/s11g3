const express = require('express');
const router = express();
const controller = require('../controller/index');
const middleware = require('../middlewares/indexMiddleware');

router.get('/', controller.getHome);
router.get('/login', controller.getLogin);
router.get('/statquery', controller.getStatsQuery);
router.get('/account', controller.getAccount);
router.get('/registration', controller.getRegister);
router.get('/changepass', controller.getChangePW);
router.get('/confirm', controller.getConfirm);
router.get('/products', controller.getProducts);
router.get('/products/sort*', controller.getProdSort);
router.get('/search', controller.getSearchPName);
router.get('/category/*', controller.getSearchCat);
router.get('/products/*', controller.getProdPage);
router.get('/orders', controller.getOrders);
router.get('/wishlist', controller.getWishlist);
router.get('/cart', controller.getCart);

router.post('/login', controller.postLogin);
router.post('/logout', controller.postLogout);
router.post('/registration', middleware.validateReg, controller.postReg);
router.post('/changepass', controller.postChangePW);
router.post('/confirm', middleware.validateConfirm, controller.postConfirm);
router.post('/addtocart/:id', controller.postAddCart);
router.post('/wishlist/:id', controller.postAddWish);
router.post('/checkout', controller.postCheckOut);

router.put('/updateCart', controller.putUpdateCart);

// AJAX methods
router.post('/delCartItem', controller.postDelCartItem);
router.post('/delWishItem', controller.postDelWishItem);

module.exports = router;
