export type User = {
    _id: string
    email: string
    fullName: string
    avt?: string
    org?: string
    descriptor?: string
    images?: string[]
    role: string
    createdAt: Date
    updatedAt: Date
}
