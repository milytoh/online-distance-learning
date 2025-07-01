const express = require('express');

const router = express.Router();

const onlineCoursController = require('../controllers/online-course')

router.get('/', onlineCoursController.getIndex);
router.get('/courses', onlineCoursController.getAllCoures)

module.exports = router;