type IPackage = {
    name: string,
    thumbnail: string,
    images: string[],
    video: string,
    shortDesc: string,
    fullDesc: string,
    license: string,
    visibility: string,
    authors: string[],
    downloadUrl: string | undefined,
}

type IGetPackage = IPackage & {
    _id: string,
    deleted: boolean,
    createdBy: string,
    likes: number,
    version: string,
    versions: string[]
}

type IUpdatePackage = IPackage & {
    _id: string,
    
}