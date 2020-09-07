import express, { Request, Response, ErrorRequestHandler } from 'express';
import morgan from "morgan";
import helmet from "helmet";
import { configuration, IConfig } from "./config";
import { ProfilModel } from './models/profils';
import {connect} from "./database";

export function createExpressApp(config: IConfig): express.Express {
  const { express_debug } = config;

  const app = express();

  app.use(morgan('combined'));
  app.use(helmet());
  app.use(express.json());

  app.use(((err, _req, res, _next) => {
    console.error(err.stack);
    res.status?.(500).send(!express_debug ? 'Oups' : err);
  }) as ErrorRequestHandler);

  app.get('/', (req: Request, res: Response) => { res.send('This is the boilerplate for Flint Messenger app') });

  app.post('/profil', (req: Request, res:Response) => {
    const {email, firstname, lastname} = req.body

    const newProfile = new ProfilModel({email: email, firstname: firstname, lastname: lastname})
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

  app.get('/profil/:id', (req:Request, res:Response) => {
    const id = req.params['id'];
    if (id !== undefined) {
      ProfilModel.findById(id)
        .then((profil) => {
          // console.log(profil)
          res.status(200).send(profil)
        }).catch((error) => {
          // console.log('error get by id:', id, error.message)
          res.status(400).header('Error', error.message).send('no user')
      })
    } else {
      return res.status(404).send('No parameter id')
    }
  })

  return app;
}

const config = configuration();
const { PORT } = config;
const app = createExpressApp(config);
connect(config).then(
    () => {app.listen(PORT, () => console.log(`Flint messenger listening at ${PORT}`));}
)
