import {Document, Schema, Model, model} from "mongoose";

export interface IMessage extends Document {
    targets: string[];
    conversationId: string;
    emitter: string;
    content: string;
    createdAt: Date;
}

const messageSchema = new Schema({
    targets: {type: [{type: Schema.Types.ObjectId, ref:"profils"}], required: true},
    conversationId: {type: String, required: true},
    emitter: {type: Schema.Types.ObjectId, ref:"profils", required: true},
    content: {type: String, required:true},
    createdAt: {type: Date, required:true, default:new Date()}
})


export const Message = model<IMessage, Model<IMessage>>("messages", messageSchema)
