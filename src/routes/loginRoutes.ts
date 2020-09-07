import { Router, Request, Response } from 'express';
import passport from 'passport';
const router = Router();

router.post('/', (req: Request, res: Response) => {
    console.log(req.body)
    passport.authenticate('local', (err, profile) => {
        console.log('done start')
        if (err) return res.status(500).send('Il y a une erreur');
        if (profile) {
            return res.status(200).send('user authenticated');
        } else {
            return res.status(401).send('Il y a une erreur');
        }
    })
})

export default router;