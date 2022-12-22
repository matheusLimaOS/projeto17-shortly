import express from 'express';
import { deleteUrl, getURL, getUrlByShortURL, insertURL } from '../controllers/urlsControllers.js';
import { verifyURL, verifyUrlForDelete } from '../middlewares/urlsMiddlewares.js';
import { verifyAuthentication } from '../middlewares/userMiddlewares.js';

export const urlsRouter = express.Router();

urlsRouter.post(`/urls/shorten`,verifyAuthentication,verifyURL,insertURL);
urlsRouter.get("/urls/:id",getURL);
urlsRouter.get("/urls/open/:shortUrl",getUrlByShortURL);
urlsRouter.delete("/urls/:id",verifyAuthentication,verifyUrlForDelete,deleteUrl);