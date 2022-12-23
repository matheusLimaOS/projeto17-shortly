import express from 'express';
import { SignIn,SignUp} from '../controllers/userControllers.js';
import { verifySignIn, verifySignUp } from '../middlewares/userMiddlewares.js';
import { verifyAuthentication } from '../middlewares/userMiddlewares.js';
import { allRoutesByUser,ranking } from '../controllers/urlsControllers.js';

export const userRouter = express.Router();

userRouter.post('/signin',verifySignIn,SignIn);
userRouter.get("/users/me",verifyAuthentication,allRoutesByUser); 
userRouter.post("/signup",verifySignUp,SignUp);
userRouter.get("/ranking",ranking);