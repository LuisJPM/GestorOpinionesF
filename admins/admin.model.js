import { Schema, model } from "mongoose";

const AdminSchema = new Schema({
    firstName: {
        type: String,
        required: [true, "The first name is required!"],
        maxlength: 25,
    },

    lastName: {
        type: String,
        required: [true, "The last name is required!"],
        maxlength: [25, "Maximum 25 characters allowed!"],
    },

    user: {
        type: String,
        unique: true,
    },

    email: {
        type: String,
        required: [true, "Email is mandatory!"],
        unique: true,
    },

    pass: {
        type: String,
        required: [true, "Password is mandatory!"],
        minlength: [8, "At least 8 characters required!"],
    },

    phoneNumber: {
        type: String,
        minlength: 8,
        maxlength: 8,
        required: [true, "Phone number is required!"],
    },

    userRole: {
        type: String,
        default: "ADMIN_ROLE",
    },

    isActive: {
        type: Boolean,
        default: true,
    }
}, 
{
    timestamps: true,
    versionKey: false
});

AdminSchema.methods.toJSON = function () {
    const { __v, pass, _id, ...adminData } = this.toObject();
    adminData.uid = _id;
    return adminData;
}

export default model("Administrator", AdminSchema);
