import { Schema, model } from "mongoose";

const CategoriaSchema = Schema({
    nombre: {
        type: String,
        required: [true, "El nombre es obligatorio!"],
        maxLength: 25,
    },

    descripcion: {
        type: String,
        required: [true, "La descripción es obligatoria!"],
        maxLength: [500, "Máximo 500 caracteres!"],
    },

    estado: {
        type: Boolean,
        default: true
    }
},
    {
        timestamps: true,
        versionKey: false
    });

export default model('Categoria', CategoriaSchema);
