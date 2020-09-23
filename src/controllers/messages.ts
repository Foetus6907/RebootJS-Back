import {IMessage, Message} from "../models/messages";
import {IProfil} from "../models/profils";

export async function createMessage(targets:string[], conversationId:string, emitter:string, content:string) {
	const newMessage = new Message({targets, conversationId, emitter, content})
	try {
		return await newMessage.save();
	} catch (e) {
		throw new Error(e)
	}
}

export async function getAllMessagesByUser(user: IProfil, conversationId?: string): Promise<IMessage[] | null> {
	try {
		const userId = user._id;
		const query: {$or: any, $and?: any} = {
			$or: [
				{emitter: userId},
				{target: userId},
			],
			$and:[{ conversationId: conversationId }]
		}
		if (!conversationId) delete query.$and;

		return await Message.find(
			query,
			null,
			{ sort: {createdAt: 1}}
		)
	} catch (e) {
		throw new Error(e)
	}
}

export async function getMessagesById(messageId: string): Promise<IMessage | null> {
	try {
		return await Message.findById(messageId)
	} catch (e) {
		throw new Error(e)
	}
}

export async function getAllMessagesByConversationId(conversationId: string): Promise<IMessage[] | null> {
	try {
		const query: {$and: any} = {
			$and:[{ conversationId: conversationId }]
		}
		return await Message.find(
			query,
			null,
			{ sort: {createdAt: 1}}
		)
	} catch (e) {
		throw new Error(e)
	}
}
