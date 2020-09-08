import {NextFunction, Response, Request} from "express";

export default function authenticationRequired(req: Request, res: Response, next: NextFunction) {
  if(req.isAuthenticated()) {
    return next()
  }
  return res.status(401).send('not authenticated')
}