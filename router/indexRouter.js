const express = require('express');
const router = express();
const controller = require('../controller/index');
const middleware = require('../middlewares/indexMiddleware');

router.get('/', controller.initLists, controller.getHome);
router.get('/asdf', controller.getAsdf);
router.get('/login', controller.getLogin);
// EDIT
router.post('/login', middleware.validateLogin, controller.postLogin);
// goes through the middleware function first
// and if it succeeds it goes to the next, hence the func next()

module.exports = router;