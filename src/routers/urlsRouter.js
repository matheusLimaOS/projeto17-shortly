import express from 'express';
import { verifyAuthentication } from '../middlewares/userMiddlewares.js';

export const urlsRouter = express.Router();

urlsRouter.post(`/urls/shorten`,verifyAuthentication);
//urlsRouter.get("/urls/:id",getUrl);