const express = require('express');
const router = express();
const controller = require('../controller/index');
const middleware = require('../middlewares/indexMiddleware');

router.get('/init', controller.initLists);
router.get('/', controller.getHome);
router.get('/login', controller.getLogin);
router.get('/stats', controller.getStats);
router.get('/account', controller.getAccount);

router.post('/login', middleware.validateLogin, controller.postLogin);
router.post('/logout', controller.postLogout);

module.exports = router;
