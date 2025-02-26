import { response, request } from "express";
import { hash, verify } from "argon2";
import User from "./user.model.js";

// Obtener todos los usuarios
export const findAllUsers = async (req = request, res = response) => {
    try {
        const { limite = 10, desde = 0 } = req.query;
        const query = { estado: true };

        const [total, users] = await Promise.all([
            User.countDocuments(query),
            User.find(query)
                .skip(Number(desde))
                .limit(Number(limite))
        ]);

        res.status(200).json({
            success: true,
            total,
            users
        });

    } catch (error) {
        res.status(500).json({
            success: false,
            msg: 'Error al obtener los usuarios!',
            error
        });
    }
};

// Obtener un usuario por su ID
export const findOneUserById = async (req, res = response) => {
    try {
        const { id } = req.params;

        const user = await User.findById(id);

        if (!user) {
            return res.status(404).json({
                success: false,
                msg: 'Usuario no encontrado!'
            });
        }

        res.status(200).json({
            success: true,
            user
        });

    } catch (error) {
        res.status(500).json({
            success: false,
            msg: 'Error al obtener el usuario!',
            error
        });
    }
};

// Actualizar un usuario por su ID
export const putUserById = async (req, res = response) => {
    try {
        const { id } = req.params;
        const { _id, password, ...data } = req.body;

        if (password) {
            data.password = await hash(password);
        }

        const user = await User.findByIdAndUpdate(id, data, { new: true });

        res.status(200).json({
            success: true,
            msg: 'Usuario actualizado!',
            user
        });

    } catch (error) {
        res.status(500).json({
            success: false,
            msg: 'Error al actualizar el usuario!',
            error
        });
    }
};

// Actualizar la contraseña del usuario
export const putPassword = async (req = request, res = response) => {
    const { oldPassword, newPassword } = req.body;
    const userId = req.usuario.id;

    try {
        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({
                success: false,
                message: "Usuario no encontrado!",
            });
        }

        const passwordMatch = await verify(user.password, oldPassword);
        if (!passwordMatch) {
            return res.status(400).json({
                success: false,
                message: "La contraseña actual es incorrecta!",
            });
        }

        const hashedPassword = await hash(newPassword);
        user.password = hashedPassword;
        await user.save();

        res.status(200).json({
            success: true,
            message: "Contraseña actualizada correctamente!",
        });

    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Error al actualizar la contraseña!",
            error: error.message,
        });
    }
};

