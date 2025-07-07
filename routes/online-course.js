const express = require('express');

const router = express.Router();

const onlineCoursController = require('../controllers/online-course');
const isAuth = require('../middleware/auth').auth

router.get('/', onlineCoursController.getIndex);
router.get('/courses',  onlineCoursController.getAllCoures);
router.get('/student/dashboard', isAuth, onlineCoursController.getAllCoures);
router.get('/course/:id', isAuth, onlineCoursController.getCourseDetail);
router.post(
  "/course/:id/complete",
  isAuth,
  onlineCoursController.markAsCompleted
);

router.post(
  "/course/:id/comment",
  isAuth,
  onlineCoursController.postComment
);




module.exports = router;