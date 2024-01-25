import { Document, Schema, model } from "mongoose";

export interface IUsuario extends Document {
    nomeUsuario: string;
    email: string;
    senha: string;
}

const schema = new Schema<IUsuario>(
    {
        nomeUsuario: {
            type: String,
            required: true,
            unique: true
        },
        email: {
            type: String,
            required: true,
            unique: true
        },
        senha: {
            type: String,
            required: true,
            select: false
        },
    },
    {
        timestamps: true,
    }
);

export default model<IUsuario>('usuario', schema);