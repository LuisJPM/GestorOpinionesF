import Category from "../categories/category.model.js";
import Publicacion from "../publicaciones/publicacion.model.js";

export const createCategory = async (req, res) => {
    try {
        const data = req.body;

        const newCategory = new Category(data);

        await newCategory.save();

        res.status(201).json({
            success: true,
            message: 'Category successfully created!',
            category: newCategory
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Error creating category!',
            error
        });
    }
};

export const getAllCategories = async (req = request, res = response) => {
    try {
        const { limit = 10, offset = 0 } = req.query;
        const filter = { status: true };

        const [total, categories] = await Promise.all([
            Category.countDocuments(filter),
            Category.find(filter)
                .skip(Number(offset))
                .limit(Number(limit))
        ]);

        res.status(200).json({
            success: true,
            total,
            categories
        });

    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Error fetching categories!',
            error
        });
    }
};

export const getCategoryByName = async (req, res) => {
    try {
        const { name } = req.params;

        const category = await Category.findOne({ name });

        if (!category) {
            return res.status(404).json({
                success: false,
                message: 'Category not found!'
            });
        }

        res.status(200).json({
            success: true,
            category
        });

    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Error retrieving category!',
            error: error.message
        });
    }
};

export const updateCategoryById = async (req, res = response) => {
    try {
        const { id } = req.params;
        const data = req.body;

        const updatedCategory = await Category.findByIdAndUpdate(id, data, { new: true });

        res.status(200).json({
            success: true,
            message: 'Category updated successfully!',
            category: updatedCategory
        });

    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Error updating category!',
            error
        });
    }
};

export const removeCategoryById = async (req, res) => {
    const { id } = req.params;

    try {
        const categoryToRemove = await Category.findById(id);

        if (!categoryToRemove || !categoryToRemove.status) {
            return res.status(404).json({
                success: false,
                message: 'Category not found or already removed!'
            });
        }

        let defaultCategory = await Category.findOne({ name: 'Uncategorized' });

        if (!defaultCategory) {
            defaultCategory = new Category({
                name: 'Uncategorized',
                description: 'Default category for unclassified posts',
                status: true
            });
            await defaultCategory.save();
        }

        const postsToReassign = await Publicacion.find({ categories: categoryToRemove._id });

        if (postsToReassign.length > 0) {
            await Publicacion.updateMany(
                { _id: { $in: postsToReassign.map(p => p._id) } },
                { $set: { categories: [defaultCategory._id] } }
            );
        }

        categoryToRemove.status = false;
        await categoryToRemove.save();

        res.status(200).json({
            success: true,
            message: 'Category removed successfully! Posts have been reassigned to "Uncategorized".'
        });

    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Error removing category!',
            error: error.message
        });
    }
};
