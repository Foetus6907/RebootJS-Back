import {Document, Schema, Model, model} from "mongoose";

export interface IProfil extends Document {
    email: string;
    lastname: string;
    firstname: string;
}

const profilSchema = new Schema({
    email: {type: String, required: true, unique: true},
    firstname: {type: String, required: true},
    lastname: {type: String, required: true}
})


export const ProfilModel = model<IProfil, Model<IProfil>>("profils.ts", profilSchema)