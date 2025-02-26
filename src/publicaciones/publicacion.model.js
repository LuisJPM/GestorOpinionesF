import { Schema, model } from "mongoose";

const PublicacionSchema = new Schema(
  {
    tittle: {
      type: String,
      required: [true, "El título es obligatorio!"],
      maxlength: [3000, "El título no puede superar los 3000 caracteres!"],
    },

    categories: [
      {
        type: Schema.Types.ObjectId,
        ref: "Category",
      },
    ],

    text: {
      type: String,
      required: [true, "El texto es obligatorio!"],
      maxlength: [5000, "El texto no puede superar los 5000 caracteres!"],
    },

    status: {
      type: Boolean,
      default: true,
    },

    userId: {
      type: Schema.Types.ObjectId,
      ref: "Usuario",
      required: true,
    },
  },
  {
    timestamps: true,
    versionKey: false,
  }
);

export default model("Publicacion", PublicacionSchema);
