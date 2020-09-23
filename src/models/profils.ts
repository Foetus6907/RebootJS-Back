import {Document, Schema, Model, model} from "mongoose";
import { SHA256 } from "crypto-js";

export interface IProfil extends Document {
    email: string;
    lastname: string;
    firstname: string;
    setPassword: (password: string) => void;
    verifyPassword: (password: string) => boolean;
    getSafeProfil: () => ISafeProfil;
    conversationSeen: {[conversationId: string]: string}
    updateSeen: (conversationId: string, seenDate: string) => void;
}

export type ISafeProfil = Pick<IProfil, '_id' | 'email' | 'lastname' | 'firstname' | 'conversationSeen'>

const profilSchema = new Schema({
    email: {type: String, required: true, unique: true},
    firstname: {type: String, required: true},
    lastname: {type: String, required: true},
    password: {type: String, required:true},
    conversationSeen: {type: Object}
})

profilSchema.methods.getSafeProfil = function(): ISafeProfil {
    const {_id, email, firstname, lastname, conversationSeen} = this;
    return {_id, email, firstname, lastname, conversationSeen};
}

profilSchema.methods.setPassword = function(password: string) {
    this.password = SHA256(password).toString();
}

profilSchema.methods.verifyPassword = function (password: string) {
    return this.password === SHA256(password).toString();
};

profilSchema.methods.updateSeen = function (conversationId: string, seenDate: string) {
    return this.conversationSeen = {...this.conversationSeen, [conversationId]: seenDate};
};
export const Profil = model<IProfil, Model<IProfil>>("profils", profilSchema)
