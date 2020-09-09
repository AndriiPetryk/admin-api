import express from 'express';
import { body } from 'express-validator/check';

import User from '../models/user';
import isAuth from '../middleware/is-auth';
import {
  login,
  signup,
  getUserStatus,
  updateUserStatus
} from '../controllers/auth';

const router = express.Router();

router.put(
  '/signup',
  [
    body('email')
      .isEmail()
      .withMessage('Please enter a valid email.')
      .custom((value, { req }) =>
        User.findOne({ email: value }).then(userDoc => {
          if (userDoc) {
            return Promise.reject('E-Mail address already exists!');
          }
        })
      )
      .normalizeEmail(),
    body('password')
      .trim()
      .isLength({ min: 5 }),
    body('name')
      .trim()
      .not()
      .isEmpty()
  ],
  signup
);

router.post('/login', login);

router.get('/status', isAuth, getUserStatus);

router.patch(
  '/status',
  isAuth,
  [
    body('status')
      .trim()
      .not()
      .isEmpty()
  ],
  updateUserStatus
);

export default router;
