export interface Judge {
    id:string,
    email:string
}

export interface AuthData {
    email: string,
    password: string,
}

export interface JwtToken {
    token: string,
    expiresIn: number
}