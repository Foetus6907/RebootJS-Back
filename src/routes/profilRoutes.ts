import {Request, Response, Router} from "express";
import {IProfil, Profil} from "../models/profils";
import authenticationRequired from "../middleware/authenticationRequire";
import {getAllProfiles, getProfile, updateProfil} from "../controllers/profils";

const router = Router();

// Create
router.post('/', (req: Request, res: Response) => {
  const {email, firstname, lastname, password} = req.body;

  const newProfile = new Profil({email: email, firstname: firstname, lastname: lastname});
  newProfile.setPassword(password);
  newProfile.save();

  res.send('Utilisateur créé');
});

// Read
router.get("/me", authenticationRequired, (request: Request, response: Response) => {
  if (!request.user) {
    return response.status(401).send()
  }
  return response.json((request.user as IProfil).getSafeProfil());
});

router.get('/:profileId', authenticationRequired, (req: Request, res: Response) => {
  const profileId = req.params['profileId'];

  getProfile(profileId)
      .then(profile => {
        if (profile === null) {
          return res.status(404).send("Profile not found");
        }
        return res.send(profile.getSafeProfil());
      }).catch(error => {
        console.error(error);
        return res.status(500).send()
      }
  )
});

router.get('/', authenticationRequired, (req: Request, res: Response) => {
  getAllProfiles()
      .then(profiles => profiles.map(profile => profile.getSafeProfil()))
      .then(safeProfiles => {
        return res.status(200).send(safeProfiles);
      })
      .catch(error => {
        console.error(error);
        return res.status(500).send();
      })
});

// Update
router.patch("/", authenticationRequired, (req: Request, res: Response) => {
  if (!req.user) {
    return res.status(401).send();
  }
  const {email, firstame, lastname, password} = req.body;

  updateProfil(req.user as IProfil, email, firstame, lastname, password)
    .then((profil) => {
      if (!profil) return res.status(401).send("Profil not found")
      return res.status(200).send(profil.getSafeProfil());
    })
    .catch(err => {
      console.log(err)
      return res.status(500).send("Internal Server Error:" + err.message.toString())
    });
})

// Delete
router.delete("/", authenticationRequired, (req: Request, res: Response) => {
  if (!req.user) {
    return res.status(401).send("Profil not found")
  }
  (req.user as IProfil).deleteOne()
    .then(_profil => res.status(200).send("Utilisateur supprimé"))
    .catch(err => {
      console.log('Error', err)
      return res.status(500).send("Internal Server Error:" + err.message.toString())
    });
});

router.patch('/conversation-seen/:conversationId', authenticationRequired, async (req, res) => {
    const user = req.user as IProfil;
    const conversationId = req.params['conversationId'];
    console.log('ici', conversationId)

    user.updateSeen(conversationId, new Date().toISOString());
    try {
        const savedUser = await user.save();
        return res.status(200).send(savedUser)
    } catch (e) {
        console.log('Error udpate user conversation-seen', e)
        return res.status(401).send('Error udpate user conversation-seen')
    }
})

export default router;
