import { response, request } from "express";
import { hash } from "argon2";
import Admin from "./admin.model.js";

export const getAllAdmins = async (req = request, res = response) => {
    try {
        const { limite = 10, desde = 0 } = req.query;
        const filtro = { estado: true };

        const [total, admins] = await Promise.all([
            Admin.countDocuments(filtro),
            Admin.find(filtro).skip(Number(desde)).limit(Number(limite))
        ]);

        res.status(200).json({ success: true, total, admins });
    } catch (error) {
        res.status(500).json({ success: false, message: "Failed to fetch admins", error });
    }
};

export const getAdminById = async (req, res) => {
    try {
        const { id } = req.params;
        const admin = await Admin.findById(id);

        if (!admin) {
            return res.status(404).json({ success: false, message: "Admin not found" });
        }

        res.status(200).json({ success: true, admin });
    } catch (error) {
        res.status(500).json({ success: false, message: "Error retrieving admin", error });
    }
};

export const modifyAdminById = async (req, res = response) => {
    try {
        const { id } = req.params;
        const { _id, password, ...restoDatos } = req.body;

        if (password) {
            restoDatos.password = await hash(password);
        }

        const admin = await Admin.findByIdAndUpdate(id, restoDatos, { new: true });

        res.status(200).json({ success: true, message: "Admin successfully updated", admin });
    } catch (error) {
        res.status(500).json({ success: false, message: "Error updating admin", error });
    }
};

export const disableAdminById = async (req, res) => {
    try {
        const { id } = req.params;
        const admin = await Admin.findByIdAndUpdate(id, { estado: false }, { new: true });

        if (!admin) {
            return res.status(404).json({ success: false, message: "Admin not found" });
        }

        res.status(200).json({ success: true, message: "Admin successfully deactivated", admin });
    } catch (error) {
        res.status(500).json({ success: false, message: "Error deactivating admin", error });
    }
};
