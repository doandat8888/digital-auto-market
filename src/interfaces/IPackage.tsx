type IPackage = {
    name: string,
    thumbnail: string,
    images: string[],
    video: string,
    shortDesc: string,
    fullDesc: string,
    license: string,
    visibility: string,
    authors: string | undefined, 
    entryPoint: string,
    source?: string
}

type IMyPackage = IListPackage & {
    deleted: boolean
}

type IAddPackage = IPackage &  {
    // downloadUrl: string | undefined,
    // deploymentUrl: string | undefined,
    category: string | undefined,
    dashboardConfig: string | undefined,
    status: string,
}

type IGetPackage = IPackage & {
    _id: string,
    deleted: boolean,
    createdBy: {
        _id: string,
        fullName: string,
        avatar: string
    },
    likes: number[],
    version: IGetVersion,
    versions: IGetVersion[],
    downloads: number,
    userLike: boolean,
    category: string,
    entryUrl: string,
    dashboardConfig: string,
    downloadUrl: string,
    state: string
}

type IListPackage = (Omit<IPackage, 'createdBy'> & {
    createdBy: string,
    deleted: boolean
})[]