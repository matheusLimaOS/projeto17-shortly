import express from 'express';
import { SignIn,SignUp} from '../controllers/userControllers.js';
import { verifySignIn, verifySignUp } from '../middlewares/userMiddlewares.js';

export const userRouter = express.Router();

userRouter.get('/signin',verifySignIn,SignIn);
userRouter.post("/signup",verifySignUp,SignUp) 