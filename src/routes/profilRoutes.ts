import {Request, Response, Router} from "express";
import {Profil} from "../models/profils";
import authenticationRequired from "../middleware/authenticationRequire";
import {getAllProfiles, getProfile} from "../controllers/profils";

const router = Router();
router.post('/', (req: Request, res: Response) => {
  const { email, firstname, lastname, password } = req.body;

  const newProfile = new Profil({email: email, firstname: firstname, lastname: lastname});
  newProfile.setPassword(password);
  newProfile.save();

  res.send('Utilisateur créé');
});

router.get('/:profileId', authenticationRequired, (req: Request, res: Response) => {
  const profileId = req.params['profileId'];

  getProfile(profileId)
    .then(profile => {
      if(profile === null) { return res.status(404).send("Profile not found"); }
      return res.send(profile.getSafeProfil());
    }).catch(error => {
      console.error(error);
      return res.status(500).send()
    }
  )
});

router.get('/', (req: Request, res: Response) => {
  getAllProfiles()
    .then(profiles => profiles.map(profile => profile.getSafeProfil()))
    .then(safeProfiles => {
      return res.status(200).send(safeProfiles);
    })
    .catch(error => {
      console.error(error);
      return res.status(500).send();
    })
})

export default router;