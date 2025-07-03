const express = require('express');

const router = express.Router();

const authController = require('../controllers/auth');
const auth = require('../middleware/auth').auth;

router.get('/signup',  authController.getSignup);

router.post("/signup", authController.postSignup);

router.get("/login", authController.getLogin);
router.get("/logout", authController.getLogout);


router.post('/login',authController.postLogin)




module.exports = router;