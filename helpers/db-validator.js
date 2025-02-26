import Role from '../role/role.model.js';
import User from '../users/user.model.js';
import Admin from '../admins/admin.model.js';
import Category from '../categories/category.model.js';
import Publicacion from '../publicaciones/publicacion.model.js';
import Comment from '../comments/comment.model.js';

export const isValidRole = async (role = '') => {
    const roleExists = await Role.findOne({ role });

    if (!roleExists) {
        throw new Error(`Role ${role} does not exist in the database!`);
    }
};

export const isUserEmailUnique = async (email = '') => {
    const emailExists = await User.findOne({ email });

    if (emailExists) {
        throw new Error(`Email ${email} exists in the database!`);
    }
};

export const doesUserExistById = async (id = '') => {
    const userExists = await User.findById(id);

    if (!userExists) {
        throw new Error(`ID ${id} does not exist!`);
    }
};

export const doesAdminExistById = async (id = '') => {
    const adminExists = await Admin.findById(id);

    if (!adminExists) {
        throw new Error(`ID ${id} does not exist!`);
    }
};

export const doesCategoryExistByName = async (name = '') => {
    const categoryExists = await Category.findOne({ name });

    if (!categoryExists) {
        throw new Error(`Category name ${name} does not exist!`);
    }
};

export const doesCategoryExistById = async (id = '') => {
    const categoryExists = await Category.findById(id);

    if (!categoryExists) {
        throw new Error(`ID ${id} does not exist!`);
    }
};

export const doesPublicationExistById = async (id = '') => {
    const publicationExists = await Publicacion.findById(id);

    if (!publicationExists) {
        throw new Error(`ID ${id} does not exist!`);
    }
};

export const doesCommentExistById = async (id = '') => {
    const commentExists = await Comment.findById(id);

    if (!commentExists) {
        throw new Error(`ID ${id} does not exist!`);
    }
};
