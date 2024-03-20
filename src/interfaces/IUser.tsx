export interface IUser {
    _id: string
    email: string
    fullName: string
    avt?: string
    org: string
    descriptor?: string
    images: string[]
    role: string
    createdAt: string
    updatedAt: string
}
