import {Strategy}  from 'passport-local';
import passport from 'passport'
import {IProfil, Profil} from "../models/profils";
import {Handler} from "express";

passport.use(
    new Strategy((username: string, password:string, done: any) => {
        console.log('new strategy callback')
        try {
            Profil.findOne({email: username}, null, (err, profil) => {
                if (err) {
                    return done(err);
                }
                if (profil) {
                    if (profil.verifyPassword(password)) {
                        return done(null, profil);
                    } else {
                      return done(new IncorrectPasswordError('Password is incorrect'))
                    }
                }
                return done(new ProfilNotFoundError('Profile not found'));
            });
        } catch (e) {
            return done(e)
        }
    })
);

passport.serializeUser(
  ({ _id }: IProfil, done) => { done(null, _id); }
)

passport.deserializeUser(
  (_id, done) => {
    Profil.findById(_id, (err, profil: IProfil) => {
      if (err) {
        return  done(err)
      } else {
        return done(undefined, profil);
      }
    })
  }
)

export const authenticationInitialize = (): Handler => passport.initialize();
export const authenticationSession = (): Handler => passport.session();
export class ProfilNotFoundError extends Error {}
export class IncorrectPasswordError extends Error {}
