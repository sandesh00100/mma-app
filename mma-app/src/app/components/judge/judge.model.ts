import { Stat } from "../matches/stat.model";

export interface Judge {
    id:string,
    email:string
}

export interface AuthData {
    email: string,
    password: string,
}