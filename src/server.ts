import express, { Request, Response, ErrorRequestHandler } from 'express';
import morgan from "morgan";
import helmet from "helmet";
import { configuration, IConfig } from "./config";
import {connect} from "./database";
import bodyParser from "body-parser";
import profileRoutes from './routes/profilRoutes';
import loginRoutes from "./routes/loginRoutes";

import { ProfilModel } from './models/profils';
import {authenticationInitialize} from "./controllers/authentification";
import session from "express-session";
import connectMongo from "connect-mongo";
import mongoose from "mongoose";

const MongoStore = connectMongo(session);

export function createExpressApp(config: IConfig): express.Express {
  const { express_debug, session_cookie_name, session_secret_key } = config;

  const app = express();
  app.use (authenticationInitialize());


  app.use(bodyParser.json());
  app.use(bodyParser.urlencoded({ extended: true }));
  app.use(morgan('combined'));
  app.use(helmet());
  app.use(express.json());


  app.use(session({
    name: session_cookie_name,
    secret: session_secret_key,
    resave: false,
    saveUninitialized: false,
    store: new MongoStore({mongooseConnection: mongoose.connection}),
  }))

  // app.use(passport.initialize())
  // app.use(passport.session());
  //app.

  app.use(((err, _req, res, _next) => {
    console.error(err.stack);
    res.status?.(500).send(!express_debug ? 'Oups' : err);
  }) as ErrorRequestHandler);

  app.get('/', (req: Request, res: Response) => { res.send('This is the boilerplate for Flint Messenger app') });

  app.use('/profil', profileRoutes);
  app.use('/login', loginRoutes);

  return app;
}

const config = configuration();
const { PORT } = config;
const app = createExpressApp(config);
connect(config).then(
    () => {app.listen(PORT, () => console.log(`Flint messenger listening at ${PORT}`));}
)
