import { saveContact } from '../controllers/controllers.js';
import express from 'express';

const router = express.Router();

export default (app) => {
    router.post('/movies', saveContact);
    app.use(router);
};
