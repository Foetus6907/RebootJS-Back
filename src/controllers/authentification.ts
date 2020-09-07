import {Strategy}  from 'passport-local';
import passport from 'passport'
import {ProfilModel} from "../models/profils";
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
                        return done(new Error('Profile not found'));
                    }
                }
                return done(new Error('Profile not found'))
            });
        } catch (e) {
            return done(e)
        }
    })
);

export const authenticationInitialize = (): Handler => passport.initialize();