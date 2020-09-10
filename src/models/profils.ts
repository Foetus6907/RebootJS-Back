import {Document, Schema, Model, model} from "mongoose";
import { SHA256 } from "crypto-js";

export interface IProfil extends Document {
    email: string;
    lastname: string;
    firstname: string;
    setPassword: (password: string) => void;
    verifyPassword: (password: string) => boolean;
    getSafeProfil: () => ISafeProfil;
}

export type ISafeProfil = Pick<IProfil, '_id' | 'email' | 'lastname' | 'firstname'>

const profilSchema = new Schema({
    email: {type: String, required: true, unique: true},
    firstname: {type: String, required: true},
    lastname: {type: String, required: true},
    password: {type: String, required:true}
})

profilSchema.methods.getSafeProfil = function(): ISafeProfil {
    const {_id, email, firstname, lastname} = this;
    return {_id, email, firstname, lastname};
}

profilSchema.methods.setPassword = function(password: string) {
    this.password = SHA256(password).toString();
}

profilSchema.methods.verifyPassword = function (password: string) {
    return this.password === SHA256(password).toString();
};

export const Profil = model<IProfil, Model<IProfil>>("profils", profilSchema)