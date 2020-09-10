import { Router, Request, Response } from 'express';
import passport from 'passport';
const router = Router();
import {IProfil} from "../models/profils";
import {IncorrectPasswordError, ProfilNotFoundError} from "../controllers/authentification";

router.post('/', (req: Request, res: Response) => {
    passport.authenticate('local', (err, profile: IProfil) => {
        console.log('done start')
        if(err) {
            if(err instanceof ProfilNotFoundError){
                return res.status(404).send('Profile not found');
            } else if(err instanceof IncorrectPasswordError) {
                return res.status(404).send('Invalid password');
            } else {
                return res.status(500).send('Il y a eu une erreur');
            }
        }
        if (profile) {
            // Creér une SESSION avec req.logIn / express Session
            req.logIn(profile, (error) => {
                if (error) {
                    console.log('error', error)
                    return res.status(500).send('Il y a une erreur pendant la connection')
                }
                return res.send(profile.getSafeProfil())
            })
        } else {
            console.log('profile error', profile)
            return res.status(401).send('Il y a une erreur');
        }
    })(req, res);
})

export default router;