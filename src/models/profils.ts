import {Document, Schema, Model, model} from "mongoose";
import { SHA256 } from "crypto-js";

export interface IProfil extends Document {
    email: string;
    lastname: string;
    firstname: string;
    setPassword: (password: string) => void;
    verifyPassword: (password: string) => boolean;
}

const profilSchema = new Schema({
    email: {type: String, required: true, unique: true},
    firstname: {type: String, required: true},
    lastname: {type: String, required: true},
    password: {type: String, required:true}
})

profilSchema.methods.setPassword = function(password: string) {
    this.password = SHA256(password).toString();
}

profilSchema.methods.verifyPassword = function (password: string) {
    return this.password === SHA256(password).toString();
};

export const ProfilModel = model<IProfil, Model<IProfil>>("profils", profilSchema)