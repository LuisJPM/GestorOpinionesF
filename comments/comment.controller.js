import { request, response } from "express";
import Comentario from "./comment.model.js";
import Publicacion from "../publicaciones/publicacion.model.js";
import Usuario from "../users/user.model.js";

export const agregarComentario = async (req = request, res = response) => {
    const { contenido, publicacionId } = req.body;
    const usuarioId = req.usuario.id;

    try {
        const publicacionExiste = await Publicacion.findById(publicacionId);
        if (!publicacionExiste) {
            return res.status(404).json({
                success: false,
                message: "Publicación no encontrada!"
            });
        }

        const autor = await Usuario.findById(usuarioId);
        if (!autor) {
            return res.status(404).json({
                success: false,
                message: "Autor no encontrado!"
            });
        }

        const comentario = new Comentario({ contenido, autor: usuarioId, publicacion: publicacionId });
        await comentario.save();

        res.status(201).json({
            success: true,
            message: "Comentario agregado!",
            comentario: {
                _id: comentario._id,
                contenido: comentario.contenido,
                autor: autor.nombre,
                publicacion: publicacionExiste.titulo,
                createdAt: comentario.createdAt,
                updatedAt: comentario.updatedAt
            }
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Error al agregar comentario!",
            error: error.message
        });
    }
};

export const obtenerTodosComentarios = async (req = request, res = response) => {
    try {
        const { limite = 10, desde = 0 } = req.query;
        const query = {};

        const [total, comentarios] = await Promise.all([
            Comentario.countDocuments(query),
            Comentario.find(query)
                .skip(Number(desde))
                .limit(Number(limite))
        ]);

        const comentariosConDetalles = await Promise.all(comentarios.map(async (comentario) => {
            const autor = await Usuario.findById(comentario.autor);
            const publicacion = await Publicacion.findById(comentario.publicacion);

            return {
                _id: comentario._id,
                contenido: comentario.contenido,
                autor: autor ? autor.nombre : 'Autor no encontrado',
                publicacion: publicacion ? publicacion.titulo : 'Publicación no encontrada',
                createdAt: comentario.createdAt,
                updatedAt: comentario.updatedAt
            };
        }));

        res.status(200).json({
            success: true,
            total,
            comentarios: comentariosConDetalles
        });

    } catch (error) {
        res.status(500).json({
            success: false,
            msg: 'Error obteniendo comentarios!',
            error: error.message
        });
    }
};

export const actualizarComentarioPorId = async (req = request, res = response) => {
    const { contenido } = req.body;
    const { id } = req.params;
    const usuarioId = req.usuario.id;

    try {
        const comentario = await Comentario.findById(id);
        if (!comentario) {
            return res.status(404).json({
                success: false,
                message: "Comentario no encontrado!"
            });
        }

        if (comentario.autor.toString() !== usuarioId) {
            return res.status(403).json({
                success: false,
                message: "No tienes permiso para editar este comentario!"
            });
        }

        comentario.contenido = contenido;
        await comentario.save();

        const autor = await Usuario.findById(comentario.autor);
        const publicacion = await Publicacion.findById(comentario.publicacion);

        res.status(200).json({
            success: true,
            message: "Comentario actualizado!",
            comentario: {
                _id: comentario._id,
                contenido: comentario.contenido,
                autor: autor ? autor.nombre : 'Autor no encontrado',
                publicacion: publicacion ? publicacion.titulo : 'Publicación no encontrada',
                createdAt: comentario.createdAt,
                updatedAt: comentario.updatedAt
            }
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Error al actualizar comentario!",
            error: error.message
        });
    }
};

export const eliminarComentarioPorId = async (req = request, res = response) => {
    const { id } = req.params;
    const usuarioId = req.usuario.id;

    try {
        const comentario = await Comentario.findById(id);
        if (!comentario) {
            return res.status(404).json({
                success: false,
                message: "Comentario no encontrado!"
            });
        }

        if (comentario.autor.toString() !== usuarioId) {
            return res.status(403).json({
                success: false,
                message: "No tienes permiso para eliminar este comentario!"
            });
        }

        await comentario.deleteOne();

        res.status(200).json({
            success: true,
            message: "Comentario eliminado!"
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Error al eliminar comentario!",
            error: error.message
        });
    }
};
