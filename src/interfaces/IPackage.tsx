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
}

type IAddPackage = IPackage &  {
    downloadUrl: string | undefined,
    deploymentUrl: string | undefined
}

type IGetPackage = IPackage & {
    _id: string,
    deleted: boolean,
    createdBy: string,
    likes: number,
    version: IGetVersion,
    versions: IGetVersion[],
}
