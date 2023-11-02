type IVersion = {
    _id: string,
    packageId: string,
    name: string,
    state: string,
    downloadUrl: string,
    desc: string,
}

type IAddVersion = {
    name?: string | undefined,
    // downloadUrl: string,
    // deploymentUrl: string,
    desc?: string | undefined,
    packageId: string,
    file: File | undefined
}

type IUpdateVersion = {
    _id: string,
    desc: string | undefined
}

type IGetVersion = IVersion &{
    createdAt: string,
    updatedAt: string,
    deploymentUrl: string,
    entryUrl: string
    __v: number
}