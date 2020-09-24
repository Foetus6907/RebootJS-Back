import express, { Request, Response, ErrorRequestHandler } from 'express';
import morgan from "morgan";
import helmet from "helmet";
import cors from 'cors';
import { configuration, IConfig } from "./config";
import {connect} from "./database";
import bodyParser from "body-parser";
import profileRoutes from './routes/profilRoutes';
import loginRoutes from "./routes/loginRoutes";
import messageRoutes from "./routes/messageRoutes"

import {authenticationInitialize, authenticationSession} from "./controllers/authentification";
import session from "express-session";
import connectMongo from "connect-mongo";
import mongoose from "mongoose";
import { initializeSockets } from './socket';


const MongoStore = connectMongo(session);
const sessionStore = new MongoStore({mongooseConnection: mongoose.connection});

export function createExpressApp(config: IConfig): express.Express {
  const { express_debug, session_cookie_name, session_secret_key } = config;

  const app = express();

  app.use(bodyParser.json());
  app.use(bodyParser.urlencoded({ extended: true }));
  app.use(morgan('combined'));
  app.use(helmet());
  app.use(express.json());
  app.use(cors({credentials: true, origin: true}))


  app.use(session({
    name: session_cookie_name,
    secret: session_secret_key,
    resave: false,
    saveUninitialized: false,
    store: sessionStore
  }))

  app.use (authenticationInitialize());
  app.use(authenticationSession());

  app.use(((err, _req, res, _next) => {
    console.error(err.stack);
    res.status?.(500).send(!express_debug ? 'Oups' : err);
  }) as ErrorRequestHandler);

  app.get('/', (req: Request, res: Response) => { res.send('This is the boilerplate for Flint Messenger app') });

  app.use('/login', loginRoutes);
  app.use('/profil', profileRoutes);
  app.use('/messages', messageRoutes);

  return app;
}

const config = configuration();
const { PORT } = config;
const app = createExpressApp(config);
connect(config).then(
    () => {
      const server = app.listen(PORT, () => console.log(`Flint messenger listening at ${PORT}`));
      initializeSockets(config, server,sessionStore)
    }
)
