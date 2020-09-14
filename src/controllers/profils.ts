import {Profil, IProfil} from "../models/profils";
import {Query} from "mongoose";

export function getProfile(profileId: string): Promise<IProfil | null> {
  return Profil.findById(profileId).then(profile => profile);
}

export function getAllProfiles(): Promise<IProfil[]> {
  return Profil.find({}).then(profiles => profiles);
}

export function updateProfil(profil: IProfil, email: string, firstname: string, lastname: string, password?: string): Promise<IProfil | null> {
  // profil.email = email;
  // profil.firstname = firstName;
  // profil.lastname = lastName;

  if (password) {
    profil.setPassword(password)
  }

  return Profil.findByIdAndUpdate(profil._id, {email, firstname, lastname}).then(profil => profil)
}