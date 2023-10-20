type IVersion = {
    _id: string,
    packageId: string,
    name: string,
    state: string,
    downloadUrl: string,
    desc: string,
}

type IAddVersion = {
    name: string,
    downloadUrl: string,
    deploymentUrl: string,
    desc: string,
    packageId: string
}

type IUpdateVersion = IAddVersion & {
    _id: string
}

type IGetVersion = IVersion &{
    createdAt: string,
    updatedAt: string,
    deploymentUrl: string,
    entryUrl: string
    __v: number
}