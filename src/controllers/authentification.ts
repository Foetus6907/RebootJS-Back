import {Strategy}  from 'passport-local';
import passport from 'passport'
import {IProfil, ProfilModel} from "../models/profils";
import {Handler} from "express";

passport.use(
    new Strategy((username: string, password:string, done: any) => {
        console.log('new strategy callback')
        try {
            ProfilModel.findOne({email: username}, null, (err, profil) => {
                if (err) {
                    return done(err);
                }
                if (profil) {
                    if (profil.verifyPassword(password)) {
                        return done(null, profil);
                    } else {
                        return done(new Error('Password verification failed'));
                    }
                }
                return done(new Error('Profile not found'))
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
    ProfilModel.findById(_id, (err, profil: IProfil) => {
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