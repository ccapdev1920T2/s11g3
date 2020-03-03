const express = require('express');
const router = express();
const controller = require('../controller/index');
const middleware = require('../middlewares/indexMiddleware');

router.get('/', controller.initLists, controller.getHome);
router.get('/asdf', controller.getAsdf);
router.get('/login', controller.getLogin);

router.post('/login', middleware.validateLogin, controller.postLogin);
router.post('/logout', controller.postLogout);

module.exports = router;