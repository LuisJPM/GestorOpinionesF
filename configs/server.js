'use strict';

import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import { dbConnection } from './mongo.js';
import limiter from '../src/middlewares/validar-cant-peticiones.js';
import authRoutes from '../src/auth/auth.routes.js';
import adminRoutes from '../src/admins/admin.routes.js';
import userRoutes from '../src/users/user.routes.js';
import categoryRoutes from '../src/categories/category.routes.js';
import publicacionRoutes from '../src/publicaciones/publicacion.routes.js';
import commentRoutes from '../src/comments/comment.routes.js';

const middlewares = (app) => {
    app.use(express.urlencoded({ extended: false }));
    app.use(cors());
    app.use(express.json());
    app.use(helmet());
    app.use(morgan('dev'));
    app.use(limiter);
}

const routes = (app) => {
    app.use("/gestorOpiniones/v1/auth", authRoutes);
    app.use("/gestorOpiniones/v1/admins", adminRoutes);
    app.use("/gestorOpiniones/v1/users", userRoutes);
    app.use("/gestorOpiniones/v1/categories", categoryRoutes);
    app.use("/gestorOpiniones/v1/publicaciones", publicacionRoutes);
    app.use("/gestorOpiniones/v1/comments", commentRoutes);
}

const conectarDB = async () => {
    try {
        await dbConnection();
        console.log('Succesful connecting to database!')
    } catch (error) {
        console.log('Error connecting to database!');
        process.exit(1);
    }
}

export const initServer = async () => {
    const app = express();
    const port = process.env.PORT || 3003;

    try {
        middlewares(app);
        conectarDB();
        routes(app);
        app.listen(port);
        console.log(`Server running on port ${port}!`);
    } catch (err) {
        console.log(`Server init failed: ${err}!`);
    }
}