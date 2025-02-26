import { Router } from "express";
import { check } from "express-validator";
import { createCategory, getAllCategories, getCategoryByName, updateCategoryById, removeCategoryById } from "./category.controller.js";
import { validarCampos } from "../middlewares/validar-campos.js";
import { validarJWTAdmin } from "../middlewares/validar-jwt.js";
import { tieneRoleAdmin } from "../middlewares/validar-roles.js";
import { existeCategoryByName, existeCategoryById } from "../helpers/db-validator.js";

const router = Router();

router.post(
    "/createCategory",
    [
        validarJWTAdmin,
        tieneRoleAdmin("ADMIN_ROLE"),
        check("id", "Invalid ID!").isMongoId(),
        validarCampos
    ],
    createCategory
)

router.get("/getAllCategories", getAllCategories)

router.get(
    "/getCategoryByName/:name",
    [
        validarJWTAdmin,
        tieneRoleAdmin("ADMIN_ROLE"),
        check("id", "Invalid ID!").isMongoId(),
        check("id").custom(existeCategoryByName),
        validarCampos
    ],
    getCategoryByName
)

router.put(
    "/updateCategoryById/:id",
    [
        validarJWTAdmin,
        tieneRoleAdmin("ADMIN_ROLE"),
        check("id", "Invalid ID!").isMongoId(),
        check("id").custom(existeCategoryById),
        validarCampos
    ],
    updateCategoryById
)

router.delete(
    "/removeCategoryById/:id",
    [
        validarJWTAdmin,
        tieneRoleAdmin("ADMIN_ROLE"),
        check("id", "Invalid ID!").isMongoId(),
        check("id").custom(existeCategoryById),
        validarCampos
    ],
    removeCategoryById
)

export default router;
