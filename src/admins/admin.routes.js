import { Router } from "express";
import { check } from "express-validator";
import { getAllAdmins, getAdminById, modifyAdminById } from "./admin.controller.js";
import { existsAdminById } from "../helpers/db-validator.js";
import { validateFields } from "../middlewares/validate-fields.js";
import { validateJWTAdmin } from "../middlewares/validate-jwt.js";
import { hasAdminRole } from "../middlewares/validate-roles.js";

const router = Router();

router.get("/getAllAdmins", getAllAdmins);

router.get(
    "/getAdminById/:id",
    [
        validateJWTAdmin,
        hasAdminRole("ADMIN_ROLE"),
        check("id", "Invalid ID!").isMongoId(),
        check("id").custom(existsAdminById),
        validateFields
    ],
    getAdminById
);

router.put(
    "/modifyAdminById/:id",
    [
        validateJWTAdmin,
        hasAdminRole("ADMIN_ROLE"),
        check("id", "Invalid ID!").isMongoId(),
        check("id").custom(existsAdminById),
        validateFields
    ],
    modifyAdminById
);

export default router;
