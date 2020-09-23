import {Request, Response, Router} from "express";
import {IMessage, Message} from "../models/messages";
import * as messagesController from "../controllers/messages";
import authenticationRequired from "../middleware/authenticationRequire";
import {IProfil} from "../models/profils";

const router = Router();

// Create
router.post("/", authenticationRequired , async (req: Request, res: Response) => {
	const {targets, conversationId, content} = req.body;
	if (!req.user) {
		return res.status(401).send("You must be authenticated")
	}
	const user = req.user as IProfil
	try {
		const createdMessage = await messagesController.createMessage(targets, conversationId,user._id , content)
		if (createdMessage) {
			return res.status(201).send(createdMessage);
		} else {
			return res.status(400).send("Error creating message");
		}
	} catch (e) {
		console.log(e);
		return 	res.status(400).send("Error creating message");

	}
});

// Message by Id
router.get("/message/:messageId", authenticationRequired, async (req: Request, res: Response) => {
	console.log('messageId')

	if(req.user) {
		if (req.params["messageId"]) {
			try {
				const message = await messagesController.getMessagesById(req.params["messageId"]);
				return res.json(message);
			} catch (e) {
				console.log("Error getting message by id", e);
				return 	res.status(400).send("Error getting message by id");
			}
		} else {
			res.status(401).send("Error missing messageId in request");
		}
	} else {
		res.status(401).send("Error authenticating user");
	}
});

// Read all Message by user and conversationID
router.get("/:conversationId", authenticationRequired, async (req: Request, res: Response) => {
	console.log('byUserConversation')
	if(req.user) {
		try {
			const messages = await messagesController.getAllMessagesByUser(req.user as IProfil, req.params["conversationId"]);
			return res.json(messages)
		} catch (e) {
			console.log("Error getting messages by user", e);
			return 	res.status(400).send("Error getting messages by user");
		}
	} else {
		res.status(401).send("Error authenticating user");
	}
});

// Read all Message by user and
router.get("/", authenticationRequired, async (req: Request, res: Response) => {
	console.log('byUserConversation')
	if(req.user) {
		try {
			const messages = await messagesController.getAllMessagesByUser(req.user as IProfil);
			return res.json(messages)
		} catch (e) {
			console.log("Error getting messages by user", e);
			return 	res.status(400).send("Error getting messages by user");
		}
	} else {
		res.status(401).send("Error authenticating user");
	}
});


router.get("/conversation/:conversationId", authenticationRequired, async (req: Request, res: Response) => {
	console.log('messageId')

	if(req.user) {
		if (req.params["conversationId"]) {
			try {
				const message = await messagesController.getAllMessagesByConversationId(req.params["conversationId"]);
				return res.json(message);
			} catch (e) {
				console.log("Error getting message by conversation id", e);
				return 	res.status(400).send("Error getting message by id");
			}
		} else {
			res.status(401).send("Error missing conversationId in request");
		}
	} else {
		res.status(401).send("Error authenticating user");
	}
});

export default router;
