'use strict';

import mongoose from 'mongoose';
import Category from '../src/categories/category.model.js';
import Admin from '../src/admins/admin.model.js';
import User from '../src/users/user.model.js';
import { hash } from 'argon2';

export const dbConnection = async () => {
    try {
        mongoose.connection.on('error', () => {
            console.log('MongoDB | Could not be connected to MongoDB');
            mongoose.disconnect();
        });
        mongoose.connection.on('connecting', () => {
            console.log('MongoDB | Try connecting...');
        });
        mongoose.connection.on('connected', () => {
            console.log('MongoDB | Connected to MongoDB');
        });
        mongoose.connection.on('open', () => {
            console.log('MongoDB | Connected to database');
        });
        mongoose.connection.on('reconnected', () => {
            console.log('MongoDB | Reconnected to MongoDB');
        });
        mongoose.connection.on('disconnected', () => {
            console.log('MongoDB | Disconnected');
        });

        mongoose.connect(process.env.URI_MONGO, {
            serverSelectionTimeoutMS: 5000,
            maxPoolSize: 50,
        });
    } catch (error) {
        console.log('Database connection failed', error);
    }
}

export const createSinCategoria = async () => {
    try {
        let sinCategoria = await Category.findOne({ name: 'Sin categoría' });

        if (!sinCategoria) {
            sinCategoria = new Category({
                name: 'Sin categoría',
                description: 'Categoría para publicaciones sin clasificación',
                status: true,
            });
            await sinCategoria.save();
            console.log('Categoría "Sin categoría" creada correctamente!');
        } else {
            console.log('La categoría "Sin categoría" ya existe!');
        }
    } catch (error) {
        console.error('Error creando la categoría "Sin categoría":', error.message);
    }
};

export const createAdmin = async () => {
    try {
        const adminExists = await Admin.findOne({ role: "ADMIN_ROLE" });

        if (!adminExists) {
            const hashedPassword = await hash("adminPassword123");

            const admin = new Admin({
                name: "Carlos",
                surname: "Pérez",
                username: "CarlosAdmin",
                email: "carlosadmin@example.com",
                password: hashedPassword,
                phone: "98765432",
                role: "ADMIN_ROLE",
            });

            await admin.save();
            console.log("Administrador creado con éxito!");
        } else {
            console.log("El administrador ya existe!");
        }
    } catch (error) {
        console.error("Error al crear el administrador:", error.message);
    }
};

export const createUser = async () => {
    try {
        const userExists = await User.findOne({ role: "USER_ROLE" });

        if (!userExists) {
            const hashedPassword = await hash("userPassword456");

            const user = new User({
                name: "Laura",
                surname: "Gómez",
                username: "LauraG",
                email: "laurag@example.com",
                password: hashedPassword,
                phone: "87654321",
                role: "USER_ROLE",
            });

            await user.save();

            console.log("Usuario creado con éxito!");
        } else {
            console.log("El Usuario ya existe!");
        }
    } catch (error) {
        console.error("Error al crear el usuario:", error.message);
    }
};
