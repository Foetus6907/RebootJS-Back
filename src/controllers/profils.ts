import { Profil, IProfil } from "../models/profils";

export function getProfile(profileId: string): Promise<IProfil | null>{
  return Profil.findById(profileId).then(profile => profile);
}

export function getAllProfiles(): Promise<IProfil[]>{
  return Profil.find({}).then(profiles => profiles);
}