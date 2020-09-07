import {Request, Response, Router} from "express";
import {ProfilModel} from "../models/profils";

const router = Router();

router.post('/', (req: Request, res:Response) => {
    const {email, firstname, lastname, password} = req.body

    const newProfile = new ProfilModel({email: email, firstname: firstname, lastname: lastname, password: password})
    newProfile.save()
        .then((response) => {
            // console.log(response)
            return res.status(201).send(response)
        })
        .catch((error) => {
            // console.log("Post error : ", error.message)
            return res.status(401).header('Error', error.message).send(null)
        });
})

router.get('/:id', (req:Request, res:Response) => {
    const id = req.params['id'];
    if (id !== undefined) {
        ProfilModel.findById(id)
            .then((profil) => {
                // console.log(profil)
                if (profil !== null) {
                    res.status(200).send(profil)
                } else {
                    res.status(404).send({})
                }
            }).catch((error) => {
            // console.log('error get by id:', id, error.message)
            res.status(400).header('Error', error.message).send('no user')
        })
    } else {
        return res.status(404).send('No parameter id')
    }
})

export default router;