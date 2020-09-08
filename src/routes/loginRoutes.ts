import { Router, Request, Response } from 'express';
import passport from 'passport';
const router = Router();
import {IProfil} from "../models/profils";

router.post('/', (req: Request, res: Response) => {
    passport.authenticate('local', (err, profile: IProfil) => {
        console.log('done start')
        if (err) return res.status(500).send('Il y a une erreur');
        if (profile) {
            // Creér une SESSION avec req.logIn / express Session
            req.logIn(profile, (error) => {
                if (error) {
                    console.log('error', error)
                    return res.status(500).send('Il y a une erreur pendant la connection')
                }
                return res.json(profile)
            })
        } else {
            console.log('profile error', profile)
            return res.status(401).send('Il y a une erreur');
        }
    })(req, res);
})

export default router;